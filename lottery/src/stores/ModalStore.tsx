import { SubStore } from './SubStore';
import { observable } from 'mobx';

class ModalStore extends SubStore {
    @observable modal: null | 'faq' = null
}

export default ModalStore;
