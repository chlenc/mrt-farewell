import { h, FunctionComponent } from 'preact';
import { inject, observer } from "mobx-preact";
import styles from './styles.less';
import TextWithLines from '@src/Components/TextWithLines';
import Tickets from '@src/layout/Bottom/Tickets';
import DappStore from '@src/stores/DappStore';

interface IProps {
    dappStore?: DappStore
}

const _Bottom: FunctionComponent<IProps> = ({dappStore}) => {
    const tickets = dappStore!.tickets;
    tickets.sort( (a, b) => a.id - b.id);
    // console.log(tickets)
    // const tickets = [ {id: 12204, endId: 10202}, {id: 100}, {id: 101},{id: 12204, endId: 10202}, ];
    return <div className={styles.root}>
        {tickets.length === 0
            ? <NoTickets/>
            : <Tickets data={tickets}/>
        }
    </div>;
};

const Bottom = inject('dappStore')(observer(_Bottom));
const NoTickets = () => (<div class={styles.noTickets}>
    <TextWithLines children="You don't have tickets yet"/>
</div>);
export default Bottom;
