import { h, FunctionComponent } from 'preact';
import styles from './styles.less';
import cn from 'classnames';

interface IProps {
    className?: string
}

const TextWithLines: FunctionComponent<IProps> = ({children, className}) => {
    return <div class={cn(styles.root, className)}>
        <div class={styles.line}/>
        <div>{children}</div>
        <div class={styles.line}/>
    </div>;
};

export default TextWithLines
