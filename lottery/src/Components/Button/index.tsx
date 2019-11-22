import { h, FunctionComponent } from 'preact';
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

const Button: FunctionComponent<IButtonProps> = ({onClick, title, style, className, disabled, action}) => {
    return <button class={cn(styles.root, className, {[styles.action]: action, [styles.disabled]: disabled})}
                   style={style}
                   disabled={disabled}
                   onClick={onClick}>{title}</button>;
};

export default Button;
