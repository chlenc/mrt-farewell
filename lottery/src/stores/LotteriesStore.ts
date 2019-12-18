import { SubStore } from '@src/stores/SubStore';
import { RootStore } from '@src/stores/RootStore';
import { action, computed, observable } from "mobx";

const constants = require('@src/json/constants.json');
const oldLotteries = require('@src/json/oldLotteries.json');
const newLotteries = require('@src/json/newLotteries.json');

class LotteriesStore extends SubStore {

    constructor(rootStore: RootStore) {
        super(rootStore);
    }

    @observable isLastLottery = false;

    @computed get lottery() {
        return this.lotteries[this.isLastLottery ? 0 : 1]
    }

    @observable lotteries = [
        {hub: constants.oldHubAddress, lotteriesList: oldLotteries}, //old
        {hub: constants.newHubAddress, lotteriesList: newLotteries}  //new
    ];

    @action
    switchLottery = () => {
        this.rootStore.dappStore.dappData = [];
        this.isLastLottery = !this.isLastLottery;
    }
}

export default LotteriesStore;
