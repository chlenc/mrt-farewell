import {h, FunctionComponent} from 'preact'
import styles from './styles.less';
import TextWithLines from '@src/Components/TextWithLines';
import Tickets from '@src/layout/Bottom/Tickets';

const Bottom: FunctionComponent = () => {
    const tickets:any[] = [];
    return <div className={styles.root}>
        {tickets.length === 0
            ? <NoTickets/>
            : <Tickets data={tickets}/>
        }
    </div>
};

const NoTickets = () => (<div class={styles.noTickets}>
    <TextWithLines children="You don't have tickets yet"/>
</div>)
export default Bottom;
