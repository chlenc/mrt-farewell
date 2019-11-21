import {h, FunctionComponent} from 'preact'
import styles from './styles.less';
import BuyZone from './BuyZone';
import Bottom from './Bottom';
import Header from './Header';
import Policy from './Policy';

const App: FunctionComponent = () => {
    return <div className={styles.root}>
        <Header/>
        <BuyZone/>
        <Bottom/>
        <Policy/>
    </div>
};

export default App;
