import { h } from 'preact';
import styles from '@src/icons/styles.less';
import cn from 'classnames';

interface IProps {
    className?: string
    onClick?: () => void
    name?: string
    glow?: boolean
}

const Ticket = ({className, onClick, name, glow}: IProps) =>
    <div style={{cursor: onClick ? 'pointer' : 'inherit'}} onClick={onClick} className={cn(styles.ticket, className)}>
        {name && <div class={styles.text}>{name}</div>}
        {glow ? <div class={styles.tsktGlow}/> : <div class={styles.tskt}/>}
    </div>;

export default Ticket;
