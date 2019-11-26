import { h, FunctionComponent } from 'preact';
import { inject, observer } from "mobx-preact";
import styles from './styles.less';
import TextWithLines from '@src/Components/TextWithLines';
import Tickets from '@src/layout/Bottom/Tickets';
import DappStore from '@src/stores/DappStore';
import LanguageStore from "@src/stores/LanguageStore";

interface IProps {
    dappStore?: DappStore
    languageStore?: LanguageStore
}

const _Bottom: FunctionComponent<IProps> = ({dappStore, languageStore}) => {
    const tickets = dappStore!.tickets;
    tickets.sort( (a, b) => a.id - b.id);
    // console.log(tickets)
    // const tickets = [ {id: 12204, endId: 10202}, {id: 100}, {id: 101},{id: 12204, endId: 10202}, ];
    return <div className={styles.root}>
        {tickets.length === 0
            ? <div class={styles.noTickets}>
                <TextWithLines children={languageStore!.t('noTicketsPlaceholder')}/>
            </div>
            : <Tickets data={tickets}/>
        }
    </div>;
};

const Bottom = inject('dappStore', 'languageStore')(observer(_Bottom));
export default Bottom;
