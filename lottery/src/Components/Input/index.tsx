import {h, FunctionComponent} from 'preact'
import styles from './styles.less'
import cn from 'classnames'

export interface IInputProps {
    className?: string
    placeholder?: string
}

const Input: FunctionComponent<IInputProps> = ({className, placeholder}) => {
    return <input placeholder={placeholder}
                  class={cn(styles.root, className)}
                  onInput={()=>{}}/>
};

export default Input;
