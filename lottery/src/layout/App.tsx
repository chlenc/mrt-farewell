import { Component, h, Fragment } from 'preact';
import styles from './styles.less';
import BuyZone from './BuyZone';
import Bottom from './Bottom';
import Header from './Header';
import Policy from './Policy';
import NotificationsStore from "@src/stores/NotificationStore";
import { AccountStore } from "@src/stores";
import { inject, observer } from "mobx-preact";
import FAQ from '@src/layout/FAQ';
import ModalStore from '@src/stores/ModalStore';

interface IProps {
    accountStore?: AccountStore
    notificationStore?: NotificationsStore
    modalStore?: ModalStore
}

@inject('accountStore', 'notificationStore', 'modalStore')
@observer
export default class App extends Component<IProps> {

    componentDidMount(): void {
        const accountStore = this.props.accountStore!;
        if (accountStore.isBrowserSupportsWavesKeeper) {
            accountStore.setupWavesKeeper();
        } else {
            this.props.notificationStore!.notify('you use unsupported browser', {type: 'warning'});
        }
    }

    render() {
        const modalStore = this.props.modalStore!;
        return <Fragment>
            {modalStore.modal && <FAQ onClose={() => this.props.modalStore!.modal = null}/>}
            <div className={styles.root}>
                <Header/>
                <BuyZone/>
                <Bottom/>
                <Policy/>
            </div>
        </Fragment>;
    }
}
