import {h, FunctionComponent} from 'preact'
import styles from './styles.less'
import cn from 'classnames'

export interface IInputProps {
    className?: string
}

const Input: FunctionComponent<IInputProps> = ({className}) => {
    return <input class={cn(styles.root, className)} onInput={()=>{}}></input>
};

export default Input;
