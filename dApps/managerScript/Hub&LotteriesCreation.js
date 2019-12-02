/// <reference path="../node_modules/@waves/js-test-env/index.d.ts" />
const fs = require("fs");
const lotteryInfo = []

const seedWithMoney = 'scorpion early squirrel place father firm nothing warrior robot secret life blur fragile barrel task'
const comissinForSetScript = 100000


//create Accounts
const seedHub = wavesCrypto.randomSeed();
const addressHub = wavesCrypto.address(seedHub, 'T');
let hub = {
    address: addressHub,
    seed: seedHub
}

for (i = 0; i < 12; i++) {
    const seedLottery = wavesCrypto.randomSeed();
    const addressLottery = wavesCrypto.address(seedLottery, 'T');
    let lottery = {
        address: addressLottery,
        sum: 500,
        seed: seedLottery
    }
    lotteryInfo.push(lottery)
}

for (i = 0; i < 6; i++) {
    const seedLottery = wavesCrypto.randomSeed();
    const addressLottery = wavesCrypto.address(seedLottery, 'T');
    let lottery = {
        address: addressLottery,
        sum: 1000,
        seed: seedLottery
    }
    lotteryInfo.push(lottery)
}
for (i = 0; i < 4; i++) {
    const seedLottery = wavesCrypto.randomSeed();
    const addressLottery = wavesCrypto.address(seedLottery, 'T');
    let lottery = {
        address: addressLottery,
        sum: 2000,
        seed: seedLottery
    }
    lotteryInfo.push(lottery)
}
fs.writeFileSync("hubInfo.json", JSON.stringify(hub, null, 4))
fs.writeFileSync("lotteryInfo.json", JSON.stringify(lotteryInfo, null, 4))
fs.writeFileSync("../../lottery/src/json/hub.json", JSON.stringify({address: hub.address}))
fs.writeFileSync("../../lottery/src/json/lotteries.json", JSON.stringify(lotteryInfo.map(({address, sum}) => ({
    address,
    sum
}))))

(async () => {
    const amount = 100000;
    const paramsForMassTransfer = {transfers: lotteryInfo.map((({address: recipient}) => ({recipient, amount})))};
    const massTx = massTransfer(paramsForMassTransfer, seedWithMoney)
    await broadcast(massTx);
    await waitForTx(massTx.id)
})();

