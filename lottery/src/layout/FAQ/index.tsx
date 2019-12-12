import { Fragment, FunctionComponent, h } from 'preact';
import Close from '@src/icons/Close';
import styles from './styles.less';
import LanguageStore from "@src/stores/LanguageStore";
import { inject, observer } from "mobx-preact";

var markdown = require("markdown").markdown;

interface IInjectedProps {
    languageStore?: LanguageStore
}

interface IProps extends IInjectedProps {
    onClose: () => void
}


const _FAQ: FunctionComponent<IProps> = ({onClose, languageStore}) => <div class={styles.root}>
    <Close className={styles.close} onClick={onClose}/>
    <div class={styles.overlay}>
        <div class={styles.header}>FAQ</div>
        <div class={styles.content}>
            {languageStore!.faqItems.map(({question, answer}, i) => <Fragment>
                    <div class={styles.question}>{`${i + 1}. ${question}`}</div>
                    {answer && <div class={styles.answer} dangerouslySetInnerHTML={{__html: markdown.toHTML(answer)}}/>}
                </Fragment>
            )}
        </div>
    </div>
</div>;


const FAQ = inject('languageStore')(observer(_FAQ));

export default FAQ;
