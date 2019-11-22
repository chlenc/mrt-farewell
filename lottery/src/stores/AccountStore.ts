import { action, autorun, computed, observable, set } from 'mobx';
import { SubStore } from './SubStore';
import { checkSlash, getCurrentBrowser } from '@src/utils';
import { base58Decode } from '@waves/ts-lib-crypto'

interface IWavesKeeperAccount {
    address: string
    name: string
    network: string
    networkCode: string
    publicKey: string
    type: string
    balance: {
        available: string
        leasedOut: string
        network: string
    }
}

export interface INetwork {
    code: string,
    server: string,
    matcher?: string
}

interface IKeeperError {
    code: string
    data: any
    message: string
}

export interface IAsset {
    assetId: string
    name: string
    decimals: number
}

class AccountStore extends SubStore {
    @observable wavesKeeperAccount?: IWavesKeeperAccount;

    @observable isWavesKeeperInitialized: boolean = false;
    @observable isWavesKeeperInstalled: boolean = false;

    @observable isApplicationAuthorizedInWavesKeeper: boolean = false;


    @computed
    get isBrowserSupportsWavesKeeper(): boolean {
        const browser = getCurrentBrowser();
        return ['chrome', 'firefox', 'opera', 'edge'].includes(browser);
    }

    @action
    updateWavesKeeperAccount = (account: IWavesKeeperAccount) => {
        this.wavesKeeperAccount && set(this.wavesKeeperAccount, {
            ...account
        });
    };

    @action
    resetWavesKeeperAccount = () => {
        this.wavesKeeperAccount = undefined;
    };

    @action
    async updateWavesKeeper(publicState: any) {
        if (this.wavesKeeperAccount) {
            publicState.account
                ? this.updateWavesKeeperAccount(publicState.account)
                : this.resetWavesKeeperAccount();
        } else {
            this.wavesKeeperAccount = publicState.account;
        }
    }

    setupWavesKeeper = () => {
        let attemptsCount = 0;

        autorun(
            (reaction) => {
                if (attemptsCount === 2) {
                    reaction.dispose();
                    console.error('keeper is not installed');
                    this.rootStore.notificationStore.notify('keeper is not installed', {
                        type: 'warning',
                    });
                } else if (window['WavesKeeper']) {
                    reaction.dispose();
                    this.isWavesKeeperInstalled = true;
                } else {
                    attemptsCount += 1;
                }
            },
            {scheduler: run => setInterval(run, 1000)}
        );
    };

    @action
    setupSynchronizationWithWavesKeeper = () => {
        (window['WavesKeeper'].initialPromise as any)
            .then((keeperApi: any) => {
                this.isWavesKeeperInitialized = true;
                return keeperApi;
            })
            .then((keeperApi: { publicState: () => void; }) => keeperApi.publicState())
            .then((publicState: any) => {
                this.isApplicationAuthorizedInWavesKeeper = true;
                this.updateWavesKeeper(publicState).catch(e => {
                    this.rootStore.notificationStore.notify(e, {type: 'error'});
                    console.error(e);
                });
                this.subscribeToWavesKeeperUpdate();
            })
            .catch((error: IKeeperError) => {
                if (error.code === '14') {
                    this.isApplicationAuthorizedInWavesKeeper = true;
                    this.subscribeToWavesKeeperUpdate();
                } else {
                    this.isApplicationAuthorizedInWavesKeeper = false;
                }
            });
    };

    login = async () => {
        if (this.isWavesKeeperInstalled && !this.isWavesKeeperInitialized) {
            this.setupSynchronizationWithWavesKeeper();
        }
        await window['WavesKeeper'].publicState().catch(e => this.rootStore.notificationStore.notify(e.message));
    };

    subscribeToWavesKeeperUpdate() {
        window['WavesKeeper'].on('update', async (publicState: any) => {
            this.updateWavesKeeper(publicState).catch(e => {
                this.rootStore.notificationStore.notify(e, {type: 'error'});
                console.error(e);
            });
        });
    }

}

export default AccountStore;
