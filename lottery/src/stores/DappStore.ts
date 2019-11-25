import { SubStore } from './SubStore';
import { IDataEntry, nodeInteraction } from '@waves/waves-transactions';
import { computed, observable, runInAction } from 'mobx';
import { RootStore } from '@src/stores/RootStore';
import { DAPP, MRT_ASSET_ID, NODE_URL, POLL_INTERVAL } from '@src/constants';

const {accountData} = nodeInteraction;


class DappStore extends SubStore {

    @observable dappData: IDataEntry[] = [];

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
            .filter(data => data.key.includes('ticketsFrom') &&  data.value === currentAccount.address)
            .map(data => {
                const [start, end] = data.key.split('_')[0]
                    .replace('ticketsFrom', '').split('To');
                return start === end
                    ? {id: +start}
                    : {id: +start, endId: +end};
            });
    }

    buyTicket = ( mrtAmount: number) => {

        const {accountStore} = this.rootStore;

        if (!accountStore.isApplicationAuthorizedInWavesKeeper) {
            this.rootStore.notificationStore.notify('Application is not authorized in WavesKeeper', {type: 'warning'});
            return;
        }

        const transactionData = {
            dApp: DAPP,
            call: {
                function: 'buyTicket',
                args: []
            },
            fee: {tokens: this.rootStore.accountStore.scripted ? '0.009' : '0.005', assetId: 'WAVES'},
            payment: [{assetId: MRT_ASSET_ID, coins: mrtAmount}]
        };

        const tx: any = {type: 16, data: transactionData};
console.log(tx)
        window['WavesKeeper'].signAndPublishTransaction(tx).then((tx: any) => {

            const transaction = JSON.parse(tx);
            console.log(transaction);
            this.rootStore.notificationStore
                .notify(`Transaction sent: ${transaction.id}\n`,
                    {
                        type: 'success',
                    });

        }).catch((error: any) => {
            console.error(error);
            this.rootStore.notificationStore.notify(error.data, {type: 'error', title: error.message});
        });
    };

    updateDappInfo = async () => {
        const data = await accountData(DAPP, NODE_URL);
        runInAction(() => {
            this.dappData.length = 0;
            this.dappData.push(...Object.values(data));
        })
    }

}


export default DappStore;
