import { Component, FunctionComponent, h } from 'preact';
import styles from './styles.less';
import { inject, observer } from "mobx-preact";
import LanguageStore from "@src/stores/LanguageStore";

interface IProps {
    languageStore?: LanguageStore
}

const Coin: FunctionComponent = () => <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="8" fill="url(#paint0_linear)"/>
    <rect width="6.15385" height="6.15385" transform="matrix(0.707109 0.707105 -0.707109 0.707105 8.04419 3.69238)"
          fill="#4E1CB2"/>
    <defs>
        <linearGradient id="paint0_linear" x1="13.8182" y1="5.06393e-07" x2="-6.00972e-07" y2="19.6364"
                        gradientUnits="userSpaceOnUse">
            <stop stop-color="white"/>
            <stop offset="1" stop-color="#8477CE"/>
        </linearGradient>
    </defs>
</svg>


@inject('languageStore')
@observer
export default class Raffle extends Component<IProps> {

    render() {
        return <div>
            <div class={styles.raffleTitle}>
                <div class={styles.row}>1 Round: &nbsp;<b>12 × 5,000</b> &nbsp;<Coin/></div>
                <div class={styles.ticketsField}>
                    {Array.from({length: 12}, (_, i) => i).map(() => <div class={styles.emptyTskt}/>)}
                </div>
            </div>
            <div class={styles.raffleTitle}>
                <div class={styles.row}>2 Round: &nbsp;<b>6 × 5,000</b> &nbsp;<Coin/></div>
                <div class={styles.ticketsField}>
                    {Array.from({length: 6}, (_, i) => i).map(() => <div class={styles.emptyTskt}/>)}
                </div>
            </div>
            <div class={styles.raffleTitle}>
                <div class={styles.row}>3 Round: &nbsp;<b>4 × 5,000</b> &nbsp;<Coin/></div>
                <div class={styles.ticketsField}>
                    {Array.from({length: 4}, (_, i) => i).map(() => <div class={styles.emptyTskt}/>)}
                </div>
            </div>
        </div>
    }
}

