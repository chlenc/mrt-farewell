import { h, FunctionalComponent } from 'preact';
import styles from './styles.less';
import Ticket from '@src/icons/Ticket';
import TicketMany from '@src/icons/TicketMany';
import TextWithLines from '@src/Components/TextWithLines';

export type TTicket = {
    id: number
}

export type TTicketRange = {
    startId: number
    endId: number
}

const isTicketRange = (t: TTicket | TTicketRange): t is TTicketRange => 'startId' in t;

interface IProps {
    data: (TTicket | TTicketRange)[]
}

const Tickets: FunctionalComponent<IProps> = ({data}) => {
    const ticketCount = data.reduce((acc, item) => acc + (isTicketRange(item) ? item.startId : 1), 0);
    return <div class={styles.root}>
        <TextWithLines children={`Your tickets ${ticketCount}`}/>
        <div class={styles.tickets}>
            {data.map(item => isTicketRange(item) ? <TicketMany/> : <Ticket/>)}
        </div>
    </div>;
};

export default Tickets;
