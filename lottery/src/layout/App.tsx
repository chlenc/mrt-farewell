import { Component, h } from 'preact'
import styles from './styles.less';
import BuyZone from './BuyZone';
import Bottom from './Bottom';
import Header from './Header';
import Policy from './Policy';
import NotificationsStore from "@src/stores/NotificationStore";
import { AccountStore } from "@src/stores";
import { inject, observer } from "mobx-preact";

interface IProps {
    accountStore?: AccountStore
    notificationStore?: NotificationsStore
}

@inject('accountStore', 'notificationStore')
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
        return <div className={styles.root}>
            <Header/>
            <BuyZone/>
            <Bottom/>
            <Policy/>
        </div>
    }
}
