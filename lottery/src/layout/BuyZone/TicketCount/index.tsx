import { h, FunctionComponent } from 'preact';
import styles from './styles.less';

const TicketCount: FunctionComponent = () => {
    const ticketCount = 248;
    const digitsArray = ticketCount.toString().split('');
    return <div className={styles.root}>
        <div class={styles.countRow}>
            {digitsArray.map((d, i) => <Digit key={i} digit={d}/>)}
        </div>
        <div class={styles.text}>tickets already sold</div>
    </div>;
};

interface IDigitProps {
    digit: string
}

const Digit: FunctionComponent<IDigitProps> = ({digit}) => (<div class={styles.digitContainer}>
    <div class={styles.digit}>{digit}</div>
    <div class={styles.line}/>
</div>);


export default TicketCount;
