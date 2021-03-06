import { FunctionalComponent, h } from 'preact';
import styles from './styles.less';
import Ticket from '@src/icons/Ticket';
import TicketMany from '@src/icons/TicketMany';
import TextWithLines from '@src/Components/TextWithLines';
import LanguageStore from "@src/stores/LanguageStore";
import { inject, observer } from "mobx-preact";
import { Scrollbars } from 'preact-custom-scrollbars';

export type TTicket = {
    id: number
}

export type TTicketRange = {
    id: number
    endId: number
}

const isTicketRange = (t: TTicket | TTicketRange): t is TTicketRange => 'endId' in t;

interface IInjectedProps {
    languageStore?: LanguageStore
}

interface IProps extends IInjectedProps {
    data: (TTicket | TTicketRange)[]
}

const _Tickets: FunctionalComponent<IProps> = ({data, languageStore}) => {
    const ticketCount = data.reduce((acc, item) => acc + (isTicketRange(item) ? item.endId - item.id + 1 : 1), 0);
    return <div class={styles.root}>
        <TextWithLines className={styles.text} children={languageStore!.t('yourTickets', {ticketCount})}/>
        <Scrollbars
            style={{
                flex: '1 0 100px',
                flexShrink: '0',
            }}
        >

            <div class={styles.tickets}>
                {data.map(item => isTicketRange(item)
                    ? <TicketMany range={`${item.id} - ${item.endId}`}/>
                    : <Ticket name={item.id.toString()}/>)}
            </div>
        </Scrollbars>
    </div>;
};
const Tickets = inject('languageStore')(observer(_Tickets));

export default Tickets;
