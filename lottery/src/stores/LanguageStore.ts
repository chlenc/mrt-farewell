import { SubStore } from '@src/stores/SubStore';
import { RootStore } from '@src/stores/RootStore';
import { action, computed, observable } from "mobx";

const resources = require('../json/languages.json');

export type TLangs = 'ru' | 'en';

export type TFaqItem = { question?: string, answer?: string }


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

    @computed
    get faqItems(): TFaqItem[] {
        const out: TFaqItem[] = [];
        Object.entries(resources[this.lang])
            .filter(([k]) => k.includes('faqTitle') || k.includes('faqText'))
            .forEach(([k, v]) => {
                const index = k[k.length - 1];
                if (!isNaN(+index))
                    out[+index] = !out[+index]
                        ? {[k.includes('faqTitle') ? 'question' : 'answer']: v}
                        : {...out[+index], [k.includes('faqTitle') ? 'question' : 'answer']: v}
            });
        return out;
    }

}

export default LanguageStore;
