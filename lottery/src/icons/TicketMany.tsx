import { h } from 'preact';
import styles from '@src/icons/styles.less';
import cn from 'classnames';

interface IProps {
    className?: string
    onClick?: () => void
    range?: string
}


const TicketMany = ({className, onClick, range}: IProps) =>
    <div style={{cursor: onClick ? 'pointer' : 'inherit'}} onClick={onClick} className={cn(styles.ticket, className)}>
        {range && <div style={{display: "flex"}} class={styles.text}>{range}</div>}
        <div class={styles.tsktMany}/>
    </div>;

export default TicketMany;
