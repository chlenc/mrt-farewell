import { h, Component, Fragment } from 'preact';
import styles from './styles.less';
import TicketCount from './TicketCount';
import BuyTicket from './BuyForm';
import Button from '@src/Components/Button';
import BuyForm from './BuyForm';

const noop = () => {
};

export default class BuyZone extends Component<{}, { isForm: boolean }> {
    state = {
        isForm: true
    };

    render() {
        return <div className={styles.root}>
            {this.state.isForm
                ? <BuyForm onSubmit={noop} onBack={() => this.setState({isForm: false})}/>
                : <Fragment>
                    <TicketCount/>
                    <Button onClick={() => this.setState({isForm: true})}
                            title="BUY TICKET FOR 25 MRT" type="big"/>
                </Fragment>
            }
        </div>;
    }
}
// const BuyZone: FunctionComponent = () => {
//
// };
//
// export default BuyZone;
