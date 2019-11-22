import { SubStore } from './SubStore';

const dApp = '';
const assetId = '8afYrbDBr6Tw5JgaWUgm2GncY7rL87JvGG7aWezWMGgZ';


class DappStore extends SubStore {

    buyTicket = (value: string,  tokens: number) => {
        const {accountStore} = this.rootStore;
        const transactionData = {
            dApp,
            call: {
                function: 'buyTicket',
                args: [{type: 'string', value}]
            },
            fee: {tokens: '0.005', assetId: 'WAVES'},
            payment: [{assetId, tokens}]
        };

        const tx: any = {
            type: 16,
            data: transactionData
        };

        if (!accountStore.isApplicationAuthorizedInWavesKeeper) {
            this.rootStore.notificationStore.notify('Application is not authorized in WavesKeeper', {type: 'warning'});
            return
        }

        window['WavesKeeper'].signAndPublishTransaction(tx).then((tx: any) => {
            const transaction = JSON.parse(tx);
            const {network} = accountStore.wavesKeeperAccount!;
            console.log(transaction);
            this.rootStore.notificationStore
                .notify(`Transaction sent: ${transaction.id}\n`,
                    {
                        type: 'success',
                    })

        }).catch((error: any) => {
            console.error(error);
            this.rootStore.notificationStore.notify(error.data, {type: 'error', title: error.message});
        });
    };

}


export default DappStore;
