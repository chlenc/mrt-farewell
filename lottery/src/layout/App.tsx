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
import Notification from "@src/Components/Notification";
import LanguageStore, { TLangs } from "@src/stores/LanguageStore";
import DappStore from "@src/stores/DappStore";
import Raffle from "@src/layout/Raffle";

interface IProps {
    accountStore?: AccountStore
    dappStore?: DappStore
    notificationStore?: NotificationsStore
    modalStore?: ModalStore
    languageStore?: LanguageStore
}

@inject('accountStore', 'notificationStore', 'modalStore', 'languageStore', 'dappStore')
@observer
export default class App extends Component<IProps> {

    componentDidMount(): void {

        const accountStore = this.props.accountStore!;
        if (accountStore.isBrowserSupportsWavesKeeper) {
            accountStore.setupWavesKeeper();
        } else {
            this.props.notificationStore!.notify('you use unsupported browser', 'warning');
        }
    }

    setLanguage = (l: TLangs) => () => this.props.languageStore!.setLanguage(l);

    render() {
        const status = this.props.dappStore!.dappData.find(({key}) => key === 'status');
        // 'ticketingPeriod'| 'raffle'
        const modalStore = this.props.modalStore!;

        let body = <Loading text={this.props.languageStore!.t("placeholder")}/>;
        if (status && status.value === 'raffle')
            body = <Raffle/>;
        else if (status && status.value === 'ticketingPeriod') body = <BuyZone/>;

        return <Fragment>
            {this.props.languageStore!.lang === 'en'
                ? <button className={styles.language} onClick={this.setLanguage('ru')}>ru</button>
                : <button className={styles.language} onClick={this.setLanguage('en')}>en</button>
            }
            {modalStore.modal &&
            <FAQ onClose={() => this.props.modalStore!.modal = null}/>
            }
            <div className={styles.root}>
                <Header/>
                {body}

                {status && (status.value === 'ticketingPeriod' || status.value === 'raffle') &&  <Bottom/>}
                <Policy/>
            </div>
            <Notification/>
        </Fragment>;
    }
}

class Loading extends Component<{ text: string }, { length: number }> {

    interval: ReturnType<typeof setInterval> | null = null;

    constructor(props: any) {
        super(props);
        this.state = {length: 3};

        this.interval = setInterval(() => {
            let length = this.state.length + 1;
            if (this.state.length === 3) length = 1;
            this.setState({length})
        }, 500);
    }

    componentWillUnmount(): void {
        this.interval && clearInterval(this.interval)
    }

    render() {
        return <div class={styles.placeholder}>
            <div class={styles.text}>{this.props.text}
            </div>
                <div class={styles.dots}>{Array.from(this.state, () => ".")}</div>
        </div>
    }
}
