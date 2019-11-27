import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import StatusAlert from "preact-status-alert";
import 'preact-status-alert/dist/status-alert.css'

const Notification: FunctionComponent = () => <div className={styles.root}><StatusAlert/></div>;

export default Notification;

