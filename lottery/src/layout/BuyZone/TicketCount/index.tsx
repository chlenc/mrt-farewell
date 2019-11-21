import { h, FunctionComponent } from 'preact';
import styles from './styles.less';
import cn from 'classnames'

interface IProps {
    totalTickets: number
    className?: string
}

const TicketCount: FunctionComponent<IProps> = ({totalTickets, className}) => {
    const digitsArray = totalTickets.toString().split('');
    return <div className={cn(styles.root, className)}>
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
