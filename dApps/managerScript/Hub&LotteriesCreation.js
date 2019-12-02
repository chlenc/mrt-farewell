
/// <reference path="../node_modules/@waves/js-test-env/index.d.ts" />
const fs = require("fs");
const lotteryInfo = []

const seedWithMoney = 'scorpion early squirrel place father firm nothing warrior robot secret life blur fragile barrel task'
const comissinForSetScript = 100000


//create Accounts
seedHub = wavesCrypto.randomSeed();
addressHub = wavesCrypto.address(seedHub, 'T');
let hub = {
    address: addressHub,
    seed :seedHub
}

for (i = 0; i < 12; i++) {
    seedLottery = wavesCrypto.randomSeed();
    addressLottery = wavesCrypto.address(seedLottery, 'T');
    let lottery = {
        address: addressLottery,
        sum : 500,
        seed :seedLottery
    }
    lotteryInfo.push(lottery)
}
    
for (i = 0; i < 6; i++) {
        seedLottery = wavesCrypto.randomSeed();
        addressLottery = wavesCrypto.address(seedLottery, 'T');
        let lottery = {
            address: addressLottery,
            sum : 1000,
            seed :seedLottery
        }
        lotteryInfo.push(lottery)
}
for (i = 0; i < 4; i++) {
    seedLottery = wavesCrypto.randomSeed();
    addressLottery = wavesCrypto.address(seedLottery, 'T');
    let lottery = {
        address: addressLottery,
        sum : 2000,
        seed :seedLottery
    }
    lotteryInfo.push(lottery)
  }
fs.writeFileSync("hubInfo.json", JSON.stringify(hub,null,4)) 
fs.writeFileSync("lotteryInfo.json", JSON.stringify(lotteryInfo,null,4))
fs.writeFileSync("../../lottery/src/json/hub.json", JSON.stringify({address: hub.address}))
fs.writeFileSync("../../lottery/src/json/lotteries.json", JSON.stringify(lotteryInfo.map(({address,sum}) => ({address,sum}))))

const paramsForMassTransfer = {
    transfers: [
      {
        amount: 100000,
        recipient: '3P23fi1qfVw6RVDn4CH2a5nNouEtWNQ4THs',
      },
      {
        amount: 200,
        recipient: '3PPnqZznWJbPG2Z1Y35w8tZzskiq5AMfUXr',
      },
    ],

  }