import { AccountStore, DappStore, ModalStore, NotificationStore , LanguageStore} from './index';

class RootStore {
    public accountStore: AccountStore;
    public dappStore: DappStore;
    public notificationStore: NotificationStore;
    public modalStore: ModalStore;
    public languageStore: LanguageStore;

    constructor() {
        this.accountStore = new AccountStore(this);
        this.dappStore = new DappStore(this);
        this.notificationStore = new NotificationStore(this);
        this.modalStore =  new ModalStore(this);
        this.languageStore =  new LanguageStore(this)
    }
}

export { RootStore };
