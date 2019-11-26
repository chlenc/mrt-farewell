import { h, FunctionComponent } from 'preact';
import styles from './styles.less';
import cn from 'classnames'
import { inject, observer } from "mobx-preact";
import AccountStore from "@src/stores/AccountStore";
import ModalStore from "@src/stores/ModalStore";
import LanguageStore from "@src/stores/LanguageStore";

interface IInjectedProps {
    languageStore?: LanguageStore
}

interface IProps extends IInjectedProps{
    totalTickets: number
    className?: string
}

const _TicketCount: FunctionComponent<IProps> = ({totalTickets, className, languageStore}) => {
    const digitsArray = totalTickets.toString().split('');
    return <div className={cn(styles.root, className)}>
        <div class={styles.countRow}>
            {digitsArray.map((d, i) => <Digit key={i} digit={d}/>)}
        </div>
        <div class={styles.text}>{languageStore!.t('ticketsSold')}</div>
    </div>;
};

interface IDigitProps {
    digit: string
}

const Digit: FunctionComponent<IDigitProps> = ({digit}) => (<div class={styles.digitContainer}>
    <div class={styles.digit}>{digit}</div>
    <div class={styles.line}/>
</div>);

const TicketCount = inject('languageStore')(observer(_TicketCount));


export default TicketCount;
