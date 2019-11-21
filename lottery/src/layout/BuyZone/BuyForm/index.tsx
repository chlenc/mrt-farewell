import { h, Component } from 'preact';
import styles from './styles.less';
import Input from '@src/Components/Input';
import Button from '@src/Components/Button';
import ArrowLeft from '@src/icons/ArrowLeft';

const TICKET_PRICE = 25;

interface IProps {
    onSubmit: (ticketNumber: number, leaseAddress: string) => any
    onBack: () => any
}

interface IState {
    addressValid?: boolean
    leaseAddress: string
    ticketAmount?: number
    mrtAmount?: number
}

export default class BuyForm extends Component<IProps, IState> {
    state: IState = {
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
        const {ticketAmount, mrtAmount, leaseAddress} = this.state;
        const isValidAddress = validateAddress(leaseAddress);
        const {onSubmit, onBack} = this.props;
        return <div className={styles.root}>
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
            <div class={styles.thirdRow}>
                <ArrowLeft onClick={onBack} className={styles.buttonSurrounding}/>
                <Button className={styles.buyButton} onClick={() => onSubmit(ticketAmount!, leaseAddress!)}
                        disabled={!(isValidAddress && ticketAmount && ticketAmount > 0)} title="BUY TICKETS" action/>
                <div class={styles.buttonSurrounding}/>
            </div>
        </div>;
    }
}

const validateAddress = (a: string) =>  a.length >10;
