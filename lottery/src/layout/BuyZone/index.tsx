import { Component, h } from 'preact';
import styles from './styles.less';
import TicketCount from './TicketCount';
import Button from '@src/Components/Button';
import Input from '@src/Components/Input';
import cn from 'classnames';
import { inject, observer } from "mobx-preact";
import AccountStore from '@src/stores/AccountStore';
import DappStore from '@src/stores/DappStore';
import { ticketPrice as TICKET_PRICE } from '@src/json/constants.json';
import { LanguageStore } from "@src/stores";

interface IState {
    ticketAmount?: number
}

interface IProps {
    accountStore?: AccountStore
    dappStore?: DappStore
    languageStore?: LanguageStore
}

@inject('accountStore', 'dappStore', 'languageStore')
@observer
export default class BuyZone extends Component<IProps, IState> {
    state: IState = {
        ticketAmount: undefined
    };


    handleBuy = (amount: number) => {
        this.props.dappStore!.buyTicket(amount * TICKET_PRICE);
    }; //todo: implement

    render() {
        const {ticketAmount} = this.state;
        const {accountStore, dappStore, languageStore} = this.props;
        const address = accountStore!.wavesKeeperAccount && accountStore!.wavesKeeperAccount.address;
        const mrtBalance = accountStore!.mrtBalance;
        const isInsufficientFunds = mrtBalance < (ticketAmount || 0) * TICKET_PRICE;

        return <div class={styles.root}>
            <TicketCount className={cn(styles.count)}
                         totalTickets={dappStore!.totalAmountSold}/>
            <Input type="number"
                   className={styles.input}
                   placeholder={languageStore!.t('inputPlaceholder')}
                   disabled={address == null}
                   value={this.state.ticketAmount}
                   error={isInsufficientFunds && this.state.ticketAmount !== undefined}
                   onInput={(e) => this.setState({ticketAmount: e.target.value && +e.target.value})}/>
            <Button onClick={() => this.handleBuy(ticketAmount || 0)}
                    disabled={accountStore!.wavesKeeperAccount == null || isInsufficientFunds || !ticketAmount}
                    className={styles.button}
                    title={!ticketAmount
                        ? languageStore!.t('buy')
                        : languageStore!.t('buyWithPrice', {price: (ticketAmount || 1) * TICKET_PRICE})
                    }
                    action/>
        </div>;
    }
}

// const validateAddress = (a: string, chainId: string): boolean => {
//     try {
//         const bytes = libs.crypto.base58Decode(a);
//         const sum = bytes.slice(-4);
//         const raw = bytes.slice(0, -4);
//         const hash = libs.crypto.keccak(libs.crypto.blake2b(raw));
//         return bytes[1] === chainId.charCodeAt(0) && sum.toString() === hash.slice(0, 4).toString();
//     } catch (e) {
//         return false;
//     }
// };
