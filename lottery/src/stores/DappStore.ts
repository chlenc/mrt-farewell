import { SubStore } from './SubStore';
import { IDataEntry, nodeInteraction } from '@waves/waves-transactions';
import { computed, observable, runInAction } from 'mobx';
import { RootStore } from '@src/stores/RootStore';
import {
    mrtAssetId as MRT_ASSET_ID,
    nodeUrl as NODE_URL,
    pollInterval as POLL_INTERVAL
} from '@src/json/constants.json';
import { balance as getLotteryBalance } from "@waves/waves-transactions/dist/nodeInteraction";

const {accountData} = nodeInteraction;

export type TLottery = {
    randomRequestTx?: IDataEntry
    startHeight?: IDataEntry
    winnerAddress?: IDataEntry
    winnerTicket?: IDataEntry
    withdrawn?: IDataEntry
    address: string
    balance: number
}

const mrtPennies = 100;

export type TLotteries = { "500": TLottery [], "1000": TLottery[], "2000": TLottery[] };

class DappStore extends SubStore {

    @observable dappData: IDataEntry[] = [];
    @observable lotteries: TLotteries | null = null;

    constructor(rootStore: RootStore) {
        super(rootStore);
        this.updateDappInfo();
        setInterval(this.updateDappInfo, POLL_INTERVAL * 1000)
    }

    @computed
    get totalAmountSold() {
        const total = this.dappData.find(data => data.key === 'ticketAmountTotal');
        return (total && total.value || 0) as number;
    }

    @computed
    get tickets() {
        const currentAccount = this.rootStore.accountStore.wavesKeeperAccount!;
        if (currentAccount == null) return [];
        return this.dappData
            .filter(data => data.key.includes('ticketsFrom') && data.value === currentAccount.address)
            .map(data => {
                const [start, end] = data.key.split('_')[0]
                    .replace('ticketsFrom', '').split('To');
                return start === end
                    ? {id: +start}
                    : {id: +start, endId: +end};
            });
    }

    buyTicket = (mrtAmount: number) => {

        const {accountStore, lotteriesStore: {lottery: {hub: dApp}}} = this.rootStore;

        if (!accountStore.isApplicationAuthorizedInWavesKeeper) {
            this.rootStore.notificationStore.notify('Application is not authorized in WavesKeeper', 'warning');
            return;
        }

        this.sendTx({
            dApp,
            call: {
                function: 'buyTicket',
                args: []
            },
            fee: {tokens: this.rootStore.accountStore.scripted ? '0.009' : '0.005', assetId: 'WAVES'},
            payment: [{assetId: MRT_ASSET_ID, coins: mrtAmount * mrtPennies}]
        });

    };

    withdraw = (address: string) => {
        const {accountStore} = this.rootStore;

        if (!accountStore.isApplicationAuthorizedInWavesKeeper) {
            this.rootStore.notificationStore.notify('Application is not authorized in WavesKeeper', 'warning');
            return;
        }
        this.sendTx({
            dApp: address,
            call: {
                args: [],
                function: 'withdraw',
            },
            fee: {tokens: this.rootStore.accountStore.scripted ? '0.009' : '0.005', assetId: 'WAVES'},
            payment: [],
        })
    };

    updateDappInfo = async () => {
        const {lotteriesStore: {lottery: {hub, lotteriesList}}} = this.rootStore;

        const data = await accountData(hub, NODE_URL);
        let lotteries: TLotteries | null = null;
        if (data.status && data.status.value === 'raffle') {
            const lotteriesArray = await Promise.all(
                lotteriesList
                    .map(async ({address, sum: key}: { address: string, sum: string }) => {
                        const balance = await getLotteryBalance(address, NODE_URL);
                        return {
                            key,
                            value: {...await accountData(address, NODE_URL), address, balance}
                        }
                    })
            );
            lotteries = {"500": [], "1000": [], "2000": []};
            lotteriesArray.forEach(({key, value}: { key: "500" | "1000" | "2000", value: TLottery }) => {
                if (lotteries === null) return;
                lotteries[key] = lotteries[key] ? [...lotteries[key], value] : [value]
            });
        }
        runInAction(() => {
            this.lotteries = lotteries;
            this.dappData.length = 0;
            this.dappData.push(...Object.values(data));
        })
    }

    sendTx = async (data: any) => {
        const tx: any = {type: 16, data};
        console.log(tx)
        window['WavesKeeper'].signAndPublishTransaction(tx).then((tx: any) => {
            const transaction = JSON.parse(tx);
            console.log(transaction);
            this.rootStore.notificationStore
                .notify(`Transaction sent: ${transaction.id}\n`, 'success');

        }).catch((error: any) => {
            console.error(error);
            this.rootStore.notificationStore.notify(
                `${error.message}\n\n${'data' in error && String(error.data) != 'null' ? error.data : ''}`,
                'error'
            );
        });
    }
}


export default DappStore;
