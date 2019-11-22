import {h, FunctionComponent} from 'preact'
import styles from './styles.less'
import cn from 'classnames'

export interface IInputProps {
    className?: string
    placeholder?: string
    error?: boolean
    errorMessage?: string
    onInput: (e: any) => void
    type?: 'number'
    value?: string | number
}

const Input: FunctionComponent<IInputProps> = ({className, placeholder, error, type, value, onInput}) => {
    return <input placeholder={placeholder}
                  spellcheck={false}
                  type={type}
                  value={value}
                  class={cn(styles.root, className, {[styles.error]: error})}
                  onInput={onInput}/>
};

export default Input;
