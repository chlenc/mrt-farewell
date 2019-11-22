import { h, Component, Fragment } from 'preact';
import styles from './styles.less';
import TicketCount from './TicketCount';
import Button from '@src/Components/Button';
import Input from '@src/Components/Input';
import ArrowLeft from '@src/icons/ArrowLeft';
import cn from 'classnames';
import {libs} from '@waves/waves-transactions';
import { inject, observer } from "mobx-preact";
import AccountStore from '@src/stores/AccountStore';
import DappStore from '@src/stores/DappStore';
import { TICKET_PRICE } from '@src/constants';

interface IState {
    isForm: boolean
    addressValid?: boolean
    leaseAddress: string
    ticketAmount?: number
    mrtAmount?: number
}
interface IProps {
    accountStore?: AccountStore
    dappStore?: DappStore
}

@inject('accountStore', 'dappStore')
@observer
export default class BuyZone extends Component<IProps, IState> {
    state: IState = {
        isForm: false,
        leaseAddress: ''
    };


    handleAddressChange = (e: any) => {
        const leaseAddress: string = e.target.value;
        this.setState({leaseAddress});
    };

    handleAmountChange = (type: 'ticket' | 'mrt') => (e: any) => {
        const v = e.target.value;
        if (v === '') {
            this.setState({mrtAmount: undefined, ticketAmount: undefined});
        } else {
            const n = +e.target.value;
            const mrtAmount = type === 'ticket' ? n * TICKET_PRICE : n;
            const ticketNumber = type === 'mrt' ? Math.floor(n / TICKET_PRICE) : n;
            this.setState({mrtAmount, ticketAmount: ticketNumber});
        }
    };

    handleBuy = () => {

        this.props.dappStore!.buyTicket(this.state.leaseAddress, this.state.mrtAmount!);
        this.setState({isForm: false})
    }; //todo: implement

    render() {
        const {ticketAmount, mrtAmount, leaseAddress, isForm: _isForm} = this.state;
        const { accountStore, dappStore } = this.props;
        const isForm = _isForm && accountStore!.wavesKeeperAccount;
        const chainId = accountStore!.wavesKeeperAccount && accountStore!.wavesKeeperAccount.networkCode;
        const mrtBalance = accountStore!.mrtBalance;
        const isInsufficientFunds = mrtBalance <( mrtAmount || 0);

        const isValidAddress = validateAddress(leaseAddress, chainId || '1');

        return <div class={styles.root}>
            <TicketCount className={cn(styles.count, {[styles.countShow]: !isForm})}
                         totalTickets={dappStore!.totalAmountSold}/>
            <div className={cn(styles.form, {[styles.formShow]: isForm})}>
                <Input placeholder="Write address to which the lease will be sent"
                       onInput={this.handleAddressChange}
                       value={leaseAddress}
                       error={leaseAddress !== '' && !isValidAddress}
                       errorMessage="Invalid address"
                       className={styles.topInput}/>

                <div class={styles.secondRow}>
                    <Input placeholder="Number of tickets"
                           error={isInsufficientFunds}
                           type="number"
                           value={ticketAmount}
                           onInput={this.handleAmountChange('ticket')}
                           className={styles.topInput}/>
                    <div class={styles.orText}>or</div>
                    <Input placeholder="Amount in MRT"
                           error={isInsufficientFunds}
                           type="number"
                           value={mrtAmount}
                           onInput={this.handleAmountChange('mrt')}
                           className={styles.topInput}/>
                </div>
            </div>

            <div class={styles.buttonContainer}>
                {isForm
                    ?
                    <Fragment><ArrowLeft onClick={() => this.setState({isForm: false})}
                                         className={styles.buttonSurrounding}/>
                        <Button className={styles.buyButton} onClick={this.handleBuy}
                                disabled={!isValidAddress || !ticketAmount || ticketAmount <= 0 || isInsufficientFunds} title="BUY TICKETS"
                                action/>
                        <div class={styles.buttonSurrounding}/>
                    </Fragment>
                    :
                    <Button onClick={() => this.setState({isForm: true})}
                            disabled={accountStore!.wavesKeeperAccount == null}
                            className={styles.buyButton}
                            title={`BUY TICKET FOR ${TICKET_PRICE} MRT`} action/>
                }
            </div>
        </div>;
    }
}

const validateAddress = (a: string, chainId: string): boolean => {
    try {
        const bytes = libs.crypto.base58Decode(a);
        const sum = bytes.slice(-4);
        const raw = bytes.slice(0, -4);
        const hash = libs.crypto.keccak(libs.crypto.blake2b(raw));
        return bytes[1] === chainId.charCodeAt(0) && sum.toString() === hash.slice(0,4).toString()
    }catch (e) {
        return false
    }
}
