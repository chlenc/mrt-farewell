import {h, FunctionComponent} from 'preact'
import styles from './styles.less';
import TicketCount from './TicketCount';
import BuyTicket from './BuyTicket';

const BuyZone: FunctionComponent = () => {
    return <div className={styles.root}>
        <TicketCount/>
        <BuyTicket/>
    </div>
};

export default BuyZone;
