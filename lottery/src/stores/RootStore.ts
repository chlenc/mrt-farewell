import { AccountStore, DappStore, ModalStore, NotificationStore, LanguageStore, LotteriesStore } from './index';

class RootStore {
    public accountStore: AccountStore;
    public lotteriesStore: LotteriesStore;
    public dappStore: DappStore;
    public notificationStore: NotificationStore;
    public modalStore: ModalStore;
    public languageStore: LanguageStore;

    constructor() {
        this.accountStore = new AccountStore(this);
        this.lotteriesStore =  new LotteriesStore(this);
        this.dappStore = new DappStore(this);
        this.notificationStore = new NotificationStore(this);
        this.modalStore =  new ModalStore(this);
        this.languageStore =  new LanguageStore(this);
    }
}

export { RootStore };
