import { FunctionComponent, h } from 'preact';
import styles from './styles.less';
import cn from 'classnames'
import { inject, observer } from "mobx-preact";
import LanguageStore from "@src/stores/LanguageStore";
import LotteriesStore from "@src/stores/LotteriesStore";

interface IInjectedProps {
    languageStore?: LanguageStore
    lotteriesStore?: LotteriesStore
}

interface IProps extends IInjectedProps {
    totalTickets: number
    className?: string
}

const _TicketCount: FunctionComponent<IProps> = ({totalTickets, className, languageStore, lotteriesStore}) => {
    const digitsArray = totalTickets.toString().split('');

    const handleSwitchLottery = () => lotteriesStore!.switchLottery()

    return <div style="width: 100%">
        <div className={cn(styles.root, className)}>
            <div class={styles.flex}>
                {!lotteriesStore!.isLastLottery && <div onClick={handleSwitchLottery} class={styles.button}>
                    <div class={cn(styles.arrow, styles['arrow-left'])}/>
                    <div class={styles.text_left}>{languageStore!.t('prevLottery')}</div>
                </div>}
            </div>
            <div class={styles.countRow}>{digitsArray.map((d, i) => <Digit key={i} digit={d}/>)}</div>
            <div class={styles.flex} style="justify-content: flex-end;">
                {lotteriesStore!.isLastLottery && <div onClick={handleSwitchLottery} class={styles.button}>
                    <div class={styles.text_right}>{languageStore!.t('nextLottery')}</div>
                    <div class={cn(styles.arrow, styles['arrow-right'])}/>
                </div>}
            </div>
        </div>

        <div class={styles.text}>{languageStore!.t(lotteriesStore!.isLastLottery ? 'ticketsSold' : 'ticketsSoldNext')}</div>
    </div>
};

interface IDigitProps {
    digit: string
}

const Digit: FunctionComponent<IDigitProps> = ({digit}) => (<div class={styles.digitContainer}>
    <div class={styles.digit}>{digit}</div>
    <div class={styles.line}/>
</div>);

const TicketCount = inject('languageStore', 'lotteriesStore')(observer(_TicketCount));


export default TicketCount;
