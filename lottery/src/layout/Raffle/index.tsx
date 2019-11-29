import { Component, FunctionComponent, h } from 'preact';
import styles from './styles.less';
import { inject, observer } from "mobx-preact";
import LanguageStore from "@src/stores/LanguageStore";
import DappStore, { TLottery } from "@src/stores/DappStore";
import Ticket from "@src/icons/Ticket";
import { AccountStore } from "@src/stores";

interface IProps {
    languageStore?: LanguageStore
    dappStore?: DappStore
    accountStore?: AccountStore
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
</svg>;


@inject('languageStore', 'dappStore', 'accountStore')
@observer
export default class Raffle extends Component<IProps> {

    render() {
        const {lotteries, withdraw} = this.props.dappStore!;
        const {wavesKeeperAccount} = this.props.accountStore!;

        return <div class={styles.root}>
            {
                lotteries && Object.entries(lotteries).map(([k, v], i) => {
                        const cost = Array.from(k);
                        cost.length === 4 && cost.splice(1, 0, ',');
                        return <div class={styles.raffleTitle}>
                            <div class={styles.row}>{i + 1} Round: &nbsp;<b>{v.length} × {cost.join('')}</b> &nbsp;<Coin/>
                            </div>
                            <div class={styles.ticketsField}>
                                {v.map((lottery: TLottery) => {
                                    if (lottery.winnerAddress && lottery.winnerTicket) {
                                        const glow = wavesKeeperAccount
                                            && lottery.withdrawn && lottery.withdrawn.value !== true
                                            && lottery.winnerAddress.value === wavesKeeperAccount.address;
                                        return <Ticket
                                            name={String(lottery.winnerTicket.value)}
                                            glow={glow}
                                            link={`https://wavesexplorer.com/address/${lottery.address}/tx`}
                                            onWithdraw={() => withdraw(lottery.address)}
                                        />
                                    }
                                    return <div class={styles.emptyTskt}/>
                                })}
                            </div>
                        </div>
                    }
                )

            }
        </div>
    }
}

