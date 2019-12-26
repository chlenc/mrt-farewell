import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import cn from 'classnames';

export interface IButtonProps {
    onClick: () => void
    action?: boolean
    title: string
    style?: any
    className?: string
    disabled?: boolean
}

const ExchangeSvg = () => <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M6.99991 7.00002L13.9998 14H0L6.99991 7.00002Z" fill="white"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.00009 6.99998L14 0H0.00017374L7.00009 6.99998Z" fill="white"/>
</svg>

export const ExchangeLink = () => <a class={cn(styles.root, styles.link)}
                              href="https://waves.exchange/"
                              target="_blank">You can buy MRT here &nbsp;<ExchangeSvg/>&nbsp; Waves.Exchange</a>;

const Button: FunctionComponent<IButtonProps> = ({onClick, title, style, className, disabled, action}) => {
    return <button class={cn(styles.root, className, {[styles.action]: action, [styles.disabled]: disabled})}
                  style={style}
                  disabled={disabled}
                  onClick={onClick}>{title}</button>;
};


export default Button;
