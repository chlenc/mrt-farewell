import { broadcast, data, massTransfer, setScript, TTx, WithId } from "@waves/waves-transactions";
import { address, randomSeed } from '@waves/ts-lib-crypto'
import { waitForTx } from "waves-transactions/generic";
import { compile } from "@waves/ride-js";
import * as fs from 'fs';


const {
    adminSeedTest: adminSeed,
    addressRandomizerTest: addressRandomizer,
    addressAdminLottery
} = require('./src/secureJson');//todo change to adminSeed

const getScriptLottery = require("./src/lotteryContract");
const getScriptHub = require("./src/hubContract");

const
    addressOwner = '3Ms4ovcT1Rtq2BExHqRbBMUeKCYmDSSGGV2',
    mrtAssetId = '3pZgFJLNfUey8rnyG6zrTVwvXdptnUZdkmpYu3wY5CuR',
    nodeUrl = 'https://testnodes.wavesnodes.com',
    ticketPrice = 100,
    replenishAmount = 1000000,
    lotteryInfo: IAccountLottery[] = [],
    sec = 1e3;

interface IAccount {
    address: string
    seed: string
}

interface IAccountLottery extends IAccount {
    sum: number
}

export const broadcastAndWaitTx = async (tx: TTx & WithId) => {
    try {
        await broadcast(tx, nodeUrl);
        await waitForTx(tx.id, 30 * sec, nodeUrl)
    } catch (e) {
        console.error(e)
        throw e
    }
};

(async () => {
    const seedHub: string = randomSeed();
    const addressHub: string = address(seedHub, 'T');
    const hub: IAccount = {address: addressHub, seed: seedHub};

    //create Accounts
    ([{sum: 500, length: 12}, {sum: 1000, length: 6}, {sum: 2000, length: 4}] as { sum: number, length: number }[])
    // ([{sum: 500, length: 1}, {sum: 1000, length: 1}, {sum: 2000, length: 1}] as { sum: number, length: number }[])
        .forEach(({sum, length}) => {
            Array.from({length}, (_, i) => i).forEach(() => {
                const seedLottery = randomSeed();
                const addressLottery = address(seedLottery, 'T');
                let lottery = {sum, address: addressLottery, seed: seedLottery};
                lotteryInfo.push(lottery)
            })
        });
    console.log('Accounts was created');

    //accrual of money on accounts
    await broadcastAndWaitTx(massTransfer({
        transfers: [hub, ...lotteryInfo]
            .map((({address: recipient}) => ({
                recipient,
                amount: recipient === addressHub ? replenishAmount + 500000 * 3 + 400000 * 2 : replenishAmount
            })))
    }, adminSeed));
    console.log('Money credited to accounts successfully');

    //compile hub dApp and set script
    const compiledHub = compile(getScriptHub(mrtAssetId, ticketPrice));
    if (!('result' in compiledHub)) throw 'incorrect hub dApp';
    await broadcastAndWaitTx(setScript({script: compiledHub.result.base64, chainId: 'T'}, seedHub));
    console.log("Hub successfully scripted");


    //compile lottery dApp and set script
    const compiledLottery = compile(getScriptLottery(addressHub, addressAdminLottery, addressRandomizer, addressOwner));
    if (!('result' in compiledLottery)) throw 'incorrect lottery dApp';
    for (const {address, seed} of lotteryInfo) {
        await broadcastAndWaitTx(setScript({script: compiledLottery.result.base64, chainId: 'T'}, seed));
        console.log(`Lottery ${address} successfully scripted`);
    }
    console.log("All lotteries successfully scripted");

    //register lotteries in hub
    await broadcastAndWaitTx(data({ //todo fix
        data: lotteryInfo.map(({address: key}) => ({key, value: true})),
        fee: 500000
    }, seedHub));
    console.log("All lotteries successfully registered in hub");

    // turn on ticketing period
    await broadcastAndWaitTx(data({
        data: [{key: "status", value: "ticketingPeriod"}],
        fee: 500000
    }, seedHub));
    console.log("Ticketing period successfully turned on");

    //save files
    fs.writeFileSync("./src/hubInfo.json", JSON.stringify(hub, null, 4));
    fs.writeFileSync("./src/lotteryInfo.json", JSON.stringify(lotteryInfo, null, 4));
    fs.writeFileSync("../../lottery/src/json/constants.json",
        JSON.stringify({hubAddress: hub.address, mrtAssetId, nodeUrl, ticketPrice, pollInterval: 5}));
    fs.writeFileSync("../../lottery/src/json/lotteries.json", JSON.stringify(lotteryInfo.map(({address, sum}) => ({
        address,
        sum
    }))));
    console.log('files saved')
})();

