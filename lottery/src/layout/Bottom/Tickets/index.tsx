import { h, FunctionalComponent } from 'preact';
import styles from './styles.less';
import Ticket from '@src/icons/Ticket';
import TicketMany from '@src/icons/TicketMany';
import TextWithLines from '@src/Components/TextWithLines';

export type TTicket = {
    id: number
}

export type TTicketRange = {
    id: number
    endId: number
}

const isTicketRange = (t: TTicket | TTicketRange): t is TTicketRange => 'endId' in t;

interface IProps {
    data: (TTicket | TTicketRange)[]
}

const Tickets: FunctionalComponent<IProps> = ({data}) => {
    const ticketCount = data.reduce((acc, item) => acc + (isTicketRange(item) ? item.id : 1), 0);
    return <div class={styles.root}>
        <TextWithLines className={styles.text} children={`Your tickets (${ticketCount}):`}/>
        <div class={styles.tickets}>
            {data.map(item => isTicketRange(item)
                ? <TicketMany range={`${item.id} - ${item.endId}`}/>
                : <Ticket name={item.id.toString()}/>)}
        </div>
    </div>;
};

export default Tickets;
