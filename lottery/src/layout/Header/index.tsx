import { h, FunctionComponent } from 'preact';
import styles from './styles.less';
import Button from '../../Components/Button';
import Title from './Title';

const Header: FunctionComponent = () => {
    return <div className={styles.root}>
        <Button onClick={() => {}} title="FAQ" type="small"/>
        <Title/>
        <Button onClick={() => {}} title="Log in" type="small"/>
    </div>;
};

export default Header;
