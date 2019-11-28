import { h } from 'preact';
import styles from '@src/icons/styles.less';
import cn from 'classnames';

interface IProps {
    className?: string
    onClick?: () => void
    range?: string
    glow?: boolean
}


const TicketMany = ({className, onClick, range, glow}: IProps) =>
    <div style={{cursor: onClick ? 'pointer' : 'inherit'}} onClick={onClick} className={cn(styles.ticket, className)}>
        {range && <div class={styles.text}>{range}</div>}
        {glow ? <div class={styles.tsktManyGlow}/> : <div class={styles.tsktMany}/>}
    </div>;

export default TicketMany;
