import { h, FunctionalComponent } from 'preact';
import styles from './styles.less';

interface IProps {
    data: any[]
}
const Tickets: FunctionalComponent<IProps> = ({data}) => {
    return <div class={styles.root}></div>;
};

export default Tickets;
