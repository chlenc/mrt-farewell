import { SubStore } from './SubStore';
import { RootStore } from './RootStore';

export type TNotifyOptions = Partial<{
    type: 'warning' | 'error' | 'success'
    title: string
}>;

class NotificationsStore extends SubStore {

    constructor(rootStore: RootStore) {
        super(rootStore);
    }

    notify(content: string, opts: TNotifyOptions = {}) {
        alert(content)
    }
}

export default NotificationsStore;
