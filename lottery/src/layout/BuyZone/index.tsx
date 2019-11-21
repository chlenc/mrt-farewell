import { h, Component, Fragment } from 'preact';
import styles from './styles.less';
import TicketCount from './TicketCount';
import BuyTicket from './BuyForm';
import Button from '@src/Components/Button';
import BuyForm from './BuyForm';

const noop = () => {
};

const TOTAL_TICKETS =1241
export default class BuyZone extends Component<{}, { isForm: boolean }> {
    state = {
        isForm: false
    };

    render() {
        return <div className={styles.root}>
            {this.state.isForm
                ? <BuyForm onSubmit={noop} onBack={() => this.setState({isForm: false})}/>
                : <Fragment>
                    <TicketCount totalTickets={TOTAL_TICKETS}/>
                    <Button onClick={() => this.setState({isForm: true})}
                            className={styles.buyButton}
                            title="BUY TICKET FOR 25 MRT" action/>
                </Fragment>
            }
        </div>;
    }
}

