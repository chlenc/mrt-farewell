import { h, FunctionComponent } from 'preact';
import styles from './styles.less';
import Button from '../../Components/Button';
import Title from './Title';

const Header: FunctionComponent = () => {
    return <div className={styles.root}>
        <Button className={styles.button} onClick={() => {}} title="FAQ"/>
        <Title/>
        <Button className={styles.button} onClick={() => {}} title="Log in"/>
    </div>;
};

export default Header;
