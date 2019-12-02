
/// <reference path="../node_modules/@waves/js-test-env/index.d.ts" />
const fs = require("fs");
const file = []
seedHub = wavesCrypto.randomSeed();
addressHub = wavesCrypto.address(seedHub, 'T');
let Hub = {
    address: addressHub,
    seed :seedHub
}
//fs.appendFileSync("HubInfo", JSON.stringify(Hub,)+ "\n")

for (i = 0; i < 12; i++) {
    seedLottery = wavesCrypto.randomSeed();
    addressLottery = wavesCrypto.address(seedLottery, 'T');
    let lottery = {
        address: addressLottery,
        sum : 500,
        seed :seedLottery
    }
    file.push(lottery)
}
    
for (i = 0; i < 6; i++) {
        seedLottery = wavesCrypto.randomSeed();
        addressLottery = wavesCrypto.address(seedLottery, 'T');
        let lottery = {
            address: addressLottery,
            sum : 1000,
            seed :seedLottery
        }
    file.push(lottery)
}
for (i = 0; i < 4; i++) {
    seedLottery = wavesCrypto.randomSeed();
    addressLottery = wavesCrypto.address(seedLottery, 'T');
    let lottery = {
        address: addressLottery,
        sum : 2000,
        seed :seedLottery
    }
    file.push(lottery)
  }
  fs.writeFile("lotteryInfo", JSON.stringify(file,null,4)) 
fs.writeFile("lotteryInfo", JSON.stringify(file,null,4))
