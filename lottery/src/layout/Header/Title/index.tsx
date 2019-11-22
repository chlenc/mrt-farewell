import { h, FunctionComponent } from 'preact';
import styles from './styles.less';
import TextWithLines from '@src/Components/TextWithLines';

const Title: FunctionComponent = () => {
    return <div className={styles.root}>
        <div class={styles.lottery}>LOTTERY</div>
        <TextWithLines>Ticketing period</TextWithLines>
    </div>;
};

export default Title;
