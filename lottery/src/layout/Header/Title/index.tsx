import { h, FunctionComponent } from 'preact';
import styles from './styles.less';

const Title: FunctionComponent = () => {
    return <div className={styles.root}>
        <div class={styles.lottery}>LOTTERY</div>
        <div class={styles.ticketing_period}>

            <div class={styles.line}/>
            <div>Ticketing period</div>
            <div class={styles.line}/>
        </div>
    </div>;
};

export default Title;
