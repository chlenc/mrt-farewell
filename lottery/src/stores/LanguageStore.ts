import { SubStore } from '@src/stores/SubStore';
import { RootStore } from '@src/stores/RootStore';
import { action, observable } from "mobx";

const resources = require('../json/languages.json');

export type TLangs = 'ru' | 'en';

class LanguageStore extends SubStore {

    @observable lang: TLangs = 'en';

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.setLanguage(this.lang)
    }

    @action
    setLanguage = (lng: TLangs) => this.lang = lng;

    t = (key: string, opts: { [k: string]: string | number } = {}): string => {
        let out: string = resources[this.lang][key];
        Object.entries(opts).forEach(([k, v]) => out = out.replace(`{{${k}}}`, String(v)));
        return out
    };

}

export default LanguageStore;
