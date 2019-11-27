import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import TextWithLines from '@src/Components/TextWithLines';
import { inject, observer } from "mobx-preact";
import AccountStore from "@src/stores/AccountStore";
import ModalStore from "@src/stores/ModalStore";
import LanguageStore from "@src/stores/LanguageStore";

interface IInjectedProps {
    accountStore?: AccountStore
    modalStore?: ModalStore
    languageStore?: LanguageStore
}

const _Title: FunctionComponent<IInjectedProps> = ({languageStore}) => {
    return <div className={styles.root}>
        <div class={styles.lottery}>{languageStore!.t('title')}</div>
        <TextWithLines>{languageStore!.t('ticketing', {period: ''})}</TextWithLines>
    </div>;
};

const Title = inject('languageStore')(observer(_Title));

export default Title;
