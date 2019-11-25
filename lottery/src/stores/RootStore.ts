import { AccountStore, DappStore, ModalStore, NotificationStore } from './index';

class RootStore {
    public accountStore: AccountStore;
    public dappStore: DappStore;
    public notificationStore: NotificationStore;
    public modalStore: ModalStore;

    constructor() {
        this.accountStore = new AccountStore(this);
        this.dappStore = new DappStore(this);
        this.notificationStore = new NotificationStore(this);
        this.modalStore =  new ModalStore(this)
    }
}

export { RootStore };
