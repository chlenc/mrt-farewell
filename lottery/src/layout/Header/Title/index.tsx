import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import TextWithLines from '@src/Components/TextWithLines';
import { inject, observer } from "mobx-preact";
import LanguageStore from "@src/stores/LanguageStore";
import DappStore from "@src/stores/DappStore";

interface IInjectedProps {
    languageStore?: LanguageStore
    dappStore?: DappStore
}

const _Title: FunctionComponent<IInjectedProps> = ({languageStore, dappStore}) => {
    const status = dappStore!.dappData.find(({key}) => key === 'status');
    let text = 'loading';
    if(status && status.value === 'raffle') text ='raffle';
    if(status && status.value === 'ticketingPeriod') text ='ticketing';
    return <div className={styles.root}>
        <div class={styles.lottery}>{languageStore!.t('title')}</div>
        <TextWithLines>
            {languageStore!.t(text, {period: ''})}
        </TextWithLines>
    </div>;
};

const Title = inject('languageStore', 'dappStore')(observer(_Title));

export default Title;
