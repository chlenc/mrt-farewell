import { h } from 'preact'
import { SubStore } from '@src/stores/SubStore';
import { RootStore } from '@src/stores/RootStore';
import { StatusAlertService } from "preact-status-alert";

class NotificationsStore extends SubStore {

    constructor(rootStore: RootStore) {
        super(rootStore);
    }

    notify(content: string | any,  type?: 'error' | 'info' | 'warning' | 'success') {
        const options = {autoHideTime: 1000000, removeAllBeforeShow: false, withCloseIcon: false};
        switch (type) {
            case "warning":
                StatusAlertService.showWarning(content, options);
                break;
            case "success":
                StatusAlertService.showSuccess(content, options);
                break;
            case "error":
                StatusAlertService.showError(content, options);
                break;
            default:
                StatusAlertService.showInfo(content, options);
        }
    }
}

export default NotificationsStore;
