import { h, FunctionComponent } from 'preact';
import styles from './styles.less';
import AccountStore from "@src/stores/AccountStore";
import ModalStore from "@src/stores/ModalStore";
import LanguageStore from "@src/stores/LanguageStore";
import { inject, observer } from "mobx-preact";
interface IInjectedProps {
    languageStore?: LanguageStore
}
const _Policy: FunctionComponent<IInjectedProps> = ({languageStore}) =>
    <div class={styles.policy}>{languageStore!.t('policy')}</div>;


const Policy = inject('languageStore')(observer(_Policy));

export default Policy;
