import {h, FunctionComponent} from 'preact'
import styles from './styles.less';
import Button from '@src/Components/Button';
import Input from '@src/Components/Input';

const BuyTicket: FunctionComponent = () => {
    return <div className={styles.root}>
        <Button onClick={() => {}} title="BUY TICKET FOR 25 MRT" type="big"/>
        <Input className={styles.input}/>
    </div>
};

export default BuyTicket;
