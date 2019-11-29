import { h } from 'preact';
import styles from '@src/icons/styles.less';
import cn from 'classnames';

interface IProps {
    className?: string
    onClick?: () => void
    onWithdraw?: () => void
    name?: string
    glow?: boolean
    link?: string
}


const Ticket = ({className, onClick, name, glow, link, onWithdraw}: IProps) =>
    <div style={{cursor: onClick ? 'pointer' : 'inherit'}} onClick={onClick} className={cn(styles.ticket, className)}>
        {name && <div class={styles.text} style={!link ? {display: "flex"} : {}}>{name}</div>}
        {link && <div class={styles.hoverBtnSet}>
            {link && <a href={link} target="_blank" class={styles.info}/>}
            {glow && <div class={styles.pipe}/>}
            {glow && <div onClick={onWithdraw} class={styles.withdraw}/>}
        </div>}
        {glow ? <div class={styles.tsktGlow}/> : <div class={styles.tskt}/>}
    </div>;

export default Ticket;
