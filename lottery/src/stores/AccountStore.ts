import { action, autorun, computed, observable, reaction, runInAction, set } from 'mobx';
import { nodeInteraction } from '@waves/waves-transactions';
import { SubStore } from './SubStore';
import { RootStore } from '@src/stores/RootStore';
import { MRT_ASSET_ID, NODE_URL, POLL_INTERVAL } from '@src/constants';
import {  getCurrentBrowser } from '@src/utils';

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

interface IKeeperError {
    code: string
    data: any
    message: string
}

class AccountStore extends SubStore {
    @observable wavesKeeperAccount?: IWavesKeeperAccount;
    @observable isWavesKeeperInitialized: boolean = false;
    @observable isWavesKeeperInstalled: boolean = false;
    @observable isApplicationAuthorizedInWavesKeeper: boolean = false;

    @observable mrtBalance = 0;
    @observable scripted = false;

    private pollTimeout?: ReturnType<typeof setTimeout>;

    constructor(rootStore: RootStore) {
        super(rootStore);

        reaction(() => this.wavesKeeperAccount && this.wavesKeeperAccount.address, async (address) => {
            console.log('reacted')
            if (this.pollTimeout) {
                clearTimeout(this.pollTimeout);
                this.pollTimeout = undefined;
            }
            if (address == null) {
                this.mrtBalance = 0;
                this.scripted =false;
                return;
            }
            this.updateAccountInfo(address);
            this.pollTimeout = this.scheduleNextUpdate(address);
        });
    }

    @computed
    get isBrowserSupportsWavesKeeper(): boolean {
        const browser = getCurrentBrowser();
        return ['chrome', 'firefox', 'opera', 'edge'].includes(browser);
    }

    @action
    updateWavesKeeperAccount = (account: IWavesKeeperAccount) =>
        this.wavesKeeperAccount && set(this.wavesKeeperAccount, {...account});


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
                    this.rootStore.notificationStore.notify('keeper is not installed', {type: 'warning',});
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

    logout = () => {
        this.wavesKeeperAccount = undefined;
        this.isWavesKeeperInitialized = false;
    };

    subscribeToWavesKeeperUpdate() {
        window['WavesKeeper'].on('update', async (publicState: any) => {
            this.updateWavesKeeper(publicState).catch(e => {
                this.rootStore.notificationStore.notify(e, {type: 'error'});
                console.error(e);
            });
        });
    }

    updateAccountInfo = async (address: string) => {
        const mrtBalance = await nodeInteraction.assetBalance(MRT_ASSET_ID, address, NODE_URL);
        const scripted = (await nodeInteraction.scriptInfo(address, NODE_URL)).script != null;
        runInAction(() => {
            this.mrtBalance = mrtBalance;
            this.scripted = scripted;
        });
    };

    scheduleNextUpdate(address: string) {
        return setTimeout(async () => {
            await this.updateAccountInfo(address);
            this.pollTimeout = this.scheduleNextUpdate(address);
        }, POLL_INTERVAL * 1000);
    }
}

export default AccountStore;
