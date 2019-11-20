import {h, FunctionComponent} from 'preact'
import styles from './styles.less';
import BuyZone from './BuyZone';
import YourTickets from './YourTickets';
import Header from './Header';

const App: FunctionComponent = () => {
    return <div className={styles.root}>
        <Header/>
        <BuyZone/>
        <YourTickets/>
    </div>
};

export default App;
