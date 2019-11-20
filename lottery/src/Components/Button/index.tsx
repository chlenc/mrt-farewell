import {h, FunctionComponent} from 'preact'
import styles from './styles.less'

export interface IButtonProps {
    onClick: () => void
    title: string
    type: 'small' | 'big'
}
const Button: FunctionComponent<IButtonProps> = ({onClick, title, type}) => {
    return <button class={type === 'big' ? styles.big : styles.small} onClick={onClick}>{title}</button>
}

export default Button;
