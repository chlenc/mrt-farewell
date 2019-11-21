import { h, Component } from 'preact';
import styles from './styles.less';
import Input from '@src/Components/Input';
import Button from '@src/Components/Button';
import ArrowLeft from '@src/icons/ArrowLeft';

const noop = () => {
};

interface IProps {
    onSubmit: () => any
    onBack: () => any
}

export default class BuyForm extends Component<IProps> {

    render() {
        const {onSubmit, onBack} = this.props;
        return <div className={styles.root}>
            <Input placeholder="Write address to which the lease will be sent"
                   className={styles.topInput}/>

            <div class={styles.secondRow}>
                <Input placeholder="Number of tickets"
                       className={styles.topInput}/>
                <div class={styles.orText}>or</div>
                <Input placeholder="Amount in MRT"
                       className={styles.topInput}/>
            </div>
            <div class={styles.thirdRow}>
                <ArrowLeft onClick={onBack} className={styles.buttonSurrounding}/>
                <Button className={styles.buyButton} onClick={noop} title="BUY TICKETS" action/>
                <div class={styles.buttonSurrounding}/>
            </div>
        </div>;
    }
}
