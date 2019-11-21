import { h, Component, Fragment } from 'preact';
import styles from './styles.less';
import TicketCount from './TicketCount';
import Button from '@src/Components/Button';
import Input from '@src/Components/Input';
import ArrowLeft from '@src/icons/ArrowLeft';
import cn from 'classnames';


const TOTAL_TICKETS = 1241;


const TICKET_PRICE = 25;


interface IState {
    isForm: boolean
    addressValid?: boolean
    leaseAddress: string
    ticketAmount?: number
    mrtAmount?: number
}

export default class BuyZone extends Component<{}, IState> {
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

    handleBuy = () => {}; //todo: implement

    render() {
        const {ticketAmount, mrtAmount, leaseAddress, isForm} = this.state;
        const isValidAddress = validateAddress(leaseAddress);

        return <div class={styles.root}>
            <TicketCount className={cn(styles.count, {[styles.countShow]: !isForm})} totalTickets={TOTAL_TICKETS}/>
            <div className={cn(styles.form, {[styles.formShow]: isForm})}>
                <Input placeholder="Write address to which the lease will be sent"
                       onInput={this.handleAddressChange}
                       value={leaseAddress}
                       error={leaseAddress !== '' && !isValidAddress}
                       errorMessage="Invalid address"
                       className={styles.topInput}/>

                <div class={styles.secondRow}>
                    <Input placeholder="Number of tickets"
                           type="number"
                           value={ticketAmount}
                           onInput={this.handleAmountChange('ticket')}
                           className={styles.topInput}/>
                    <div class={styles.orText}>or</div>
                    <Input placeholder="Amount in MRT"
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
                                disabled={!(isValidAddress && ticketAmount && ticketAmount > 0)} title="BUY TICKETS"
                                action/>
                        <div class={styles.buttonSurrounding}/>
                    </Fragment>
                    :
                    <Button onClick={() => this.setState({isForm: true})}
                            className={styles.buyButton}
                            title="BUY TICKET FOR 25 MRT" action/>
                }
            </div>
        </div>;
    }
}

const validateAddress = (a: string) => a.length > 10;
