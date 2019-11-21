import { h, Component, Fragment } from 'preact';
import styles from './styles.less';
import TicketCount from './TicketCount';
import BuyTicket from './BuyForm';
import Button from '@src/Components/Button';
import Input from '@src/Components/Input';
import ArrowLeft from '@src/icons/ArrowLeft';
import cn from 'classnames';


const TOTAL_TICKETS = 1241;


const TICKET_PRICE = 25;

interface IProps {
    onSubmit: (ticketNumber: number, leaseAddress: string) => any
    onBack: () => any
}

interface IState {
    isForm: boolean
    addressValid?: boolean
    leaseAddress: string
    ticketAmount?: number
    mrtAmount?: number
    init: boolean
}

export default class BuyZone extends Component<IProps, IState> {
    state: IState = {
        isForm: false,
        init: false,
        leaseAddress: ''
    };

    handleAddress = (e: any) => {
        const leaseAddress: string = e.target.value;
        this.setState({leaseAddress});
    };

    handleAmount = (type: 'ticket' | 'mrt') => (e: any) => {
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

    render() {
        const {ticketAmount, mrtAmount, leaseAddress, init, isForm} = this.state;
        const isValidAddress = validateAddress(leaseAddress);
        const {onSubmit, onBack} = this.props;

        return <div class={styles.root}>
            <TicketCount className={cn(styles.count, {[styles.countShow]: !isForm})} totalTickets={TOTAL_TICKETS}/>
            <div className={cn(styles.form, {[styles.formShow]: isForm})}>
                <Input placeholder="Write address to which the lease will be sent"
                       onInput={this.handleAddress}
                       value={leaseAddress}
                       error={leaseAddress !== '' && !isValidAddress}
                       errorMessage="Invalid address"
                       className={styles.topInput}/>

                <div class={styles.secondRow}>
                    <Input placeholder="Number of tickets"
                           type="number"
                           value={ticketAmount}
                           onInput={this.handleAmount('ticket')}
                           className={styles.topInput}/>
                    <div class={styles.orText}>or</div>
                    <Input placeholder="Amount in MRT"
                           type="number"
                           value={mrtAmount}
                           onInput={this.handleAmount('mrt')}
                           className={styles.topInput}/>
                </div>
            </div>

            <div class={styles.buttonContainer}>
                {isForm
                    ?
                    <Fragment><ArrowLeft onClick={() => this.setState({isForm: false})}
                                         className={styles.buttonSurrounding}/>
                        <Button className={styles.buyButton} onClick={() => onSubmit(ticketAmount!, leaseAddress!)}
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
