import { h, Component, Fragment } from 'preact';
import styles from './styles.less';
import TicketCount from './TicketCount';
import Button from '@src/Components/Button';
import Input from '@src/Components/Input';
import ArrowLeft from '@src/icons/ArrowLeft';
import cn from 'classnames';
// import { libs } from '@waves/waves-transactions';
import { inject, observer } from "mobx-preact";
import AccountStore from '@src/stores/AccountStore';
import DappStore from '@src/stores/DappStore';
import { TICKET_PRICE } from '@src/constants';

interface IState {
    ticketAmount?: number
}

interface IProps {
    accountStore?: AccountStore
    dappStore?: DappStore
}

@inject('accountStore', 'dappStore')
@observer
export default class BuyZone extends Component<IProps, IState> {
    state: IState = {
        ticketAmount: undefined
    };


    // handleAddressChange = (e: any) => {
    //     const leaseAddress: string = e.target.value;
    //     this.setState({leaseAddress});
    // };

    // handleAmountChange = (type: 'ticket' | 'mrt') => (e: any) => {
    //     const v = e.target.value;
    //     if (v === '') {
    //         this.setState({mrtAmount: undefined, ticketAmount: undefined});
    //     } else {
    //         const n = +e.target.value;
    //         const mrtAmount = type === 'ticket' ? n * TICKET_PRICE : n;
    //         const ticketNumber = type === 'mrt' ? Math.floor(n / TICKET_PRICE) : n;
    //         this.setState({mrtAmount, ticketAmount: ticketNumber});
    //     }
    // };

    handleBuy = (amount: number, address: string) => {
        this.props.dappStore!.buyTicket(address, amount);
    }; //todo: implement

    render() {
        const {ticketAmount} = this.state;
        const {accountStore, dappStore} = this.props;
        const address = accountStore!.wavesKeeperAccount && accountStore!.wavesKeeperAccount.address;
        const mrtBalance = accountStore!.mrtBalance;
        const isInsufficientFunds = mrtBalance < (ticketAmount || 0) * TICKET_PRICE;

        return <div class={styles.root}>
            <TicketCount className={cn(styles.count)}
                         totalTickets={dappStore!.totalAmountSold}/>
            <Input type="number"
                   className={styles.input}
                   placeholder="Number of tickets you want to buy"
                   disabled={address == null}
                   value={this.state.ticketAmount}
                   error={isInsufficientFunds && this.state.ticketAmount !== undefined}
                   onInput={(e) => this.setState({ticketAmount: e.target.value && +e.target.value})}/>
            <Button onClick={() => this.handleBuy(ticketAmount || 0, address || '')}
                    disabled={accountStore!.wavesKeeperAccount == null || isInsufficientFunds || !ticketAmount}
                    className={styles.button}
                    title={`BUY TICKETS FOR ${TICKET_PRICE} MRT`} action/>
        </div>;
    }
}

// const validateAddress = (a: string, chainId: string): boolean => {
//     try {
//         const bytes = libs.crypto.base58Decode(a);
//         const sum = bytes.slice(-4);
//         const raw = bytes.slice(0, -4);
//         const hash = libs.crypto.keccak(libs.crypto.blake2b(raw));
//         return bytes[1] === chainId.charCodeAt(0) && sum.toString() === hash.slice(0, 4).toString();
//     } catch (e) {
//         return false;
//     }
// };
