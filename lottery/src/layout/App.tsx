import {h, FunctionComponent} from 'preact'
import styles from './styles.less';
import BuyZone from './BuyZone';
import Bottom from './Bottom';
import Header from './Header';

const App: FunctionComponent = () => {
    return <div className={styles.root}>
        <Header/>
        <BuyZone/>
        <Bottom/>
    </div>
};

export default App;
