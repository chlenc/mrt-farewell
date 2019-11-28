/// <reference path="../node_modules/@waves/js-test-env/index.d.ts" />

const getScriptLottery = require("./lotteryContract");
const getScriptHub = require("./hubContract");
const MRTid = "8afYrbDBr6Tw5JgaWUgm2GncY7rL87JvGG7aWezWMGgZ";


(async () => {
    // Functions, available in tests, also available here

    const seedWithMoney = 'scorpion early squirrel place father firm nothing warrior robot secret life blur fragile barrel task'
    const seedHubLottery =  wavesCrypto.randomSeed();
    const seedLottery = wavesCrypto.randomSeed();
    const seedRandomizer = wavesCrypto.randomSeed();
    const addressHubLottery = wavesCrypto.address(seedHubLottery, 'T');
    const addressLottery = wavesCrypto.address(seedLottery, 'T');
    const addressRandomizer = wavesCrypto.address(seedRandomizer, 'T');

    const addressAdminLottery = "3MrC1oqVCoLkfHabhJtrLJS6GxcooQwRWuP"
    const addressOwner = addressAdminLottery
    // You can set env varibles via cli arguments. E.g.: `surfboard run path/to/script  --variables 'dappSeed=seed phrase,secondVariable=200'`


    const transferToHubTx = transfer({
        amount: 10000000,
        recipient: addressHubLottery,
        fee: 1400000
      }, seedWithMoney);
    await broadcast(transferToHubTx);
    await waitForTx(transferToHubTx.id);
    console.log("\nHub seccessfully replanished. Hub address: ", addressHubLottery,"seed: ", seedHubLottery, "\n");

    const transferTolottery = transfer({
        amount: 10000000,
        recipient: addressLottery,
        fee: 1400000
      }, seedWithMoney);
    await broadcast(transferTolottery);
    await waitForTx(transferTolottery.id);
    console.log("Lottery seccessfully replanished. Lottery address: ", addressLottery,"seed: ", seedLottery ,"\n");

    const paramsFotData = {
        data: [
          { key: "lottery_" + addressLottery, value: true },
          { key: "status" , value: "ticketingPeriod" },
        ],
        fee: 1400000 
      }
    
    const addLotteryAddtessToHub = data(
        paramsFotData, 
        seedHubLottery);
    await broadcast(addLotteryAddtessToHub);
    await waitForTx(addLotteryAddtessToHub.id);
    console.log("Lottery address successfully added to WhiteList in Hub state\n");

    //  моделируем запись в стейт рандомайзера. случайное значение содержится по ключу registerRandomRequestTx
    const transferToRandomizerTx = transfer({
        amount: 10000000,
        recipient: addressRandomizer,
        fee: 1000000
      }, seedWithMoney);
    await broadcast(transferToRandomizerTx);
    await waitForTx(transferToRandomizerTx.id);
    
    const paramsFotRandomizer = {
        data: [
          { key: "2vmvnr79De1Y9GtMM3NQfhzrbwt93UuUMCER6GbBTFsj", 
            value: "FINISHED_EtVkT6ed8GtbUiVVEqdmEqsp2J4qbb3rre2HFgxeVYdg_1_100_1_0_5_5RcBfzpNRkswYCgfCMttLxR4u88yer1AQSApxzw8CLW9_11_0_1_0_1_--2" },
        ],
        fee: 1000000 
      }
    const randomResult = data(
        paramsFotRandomizer, 
        seedRandomizer);
    await broadcast(randomResult);
    await waitForTx(randomResult.id);
    console.log("random in state of the next addess: ", addressRandomizer, "\n");


    const pubKeyOwner = publicKey(seedLottery)
    compiledHub = compile(getScriptHub(MRTid))
    const SetSctiptHub = setScript({script:compiledHub},seedHubLottery)
    await broadcast(SetSctiptHub);
    await waitForTx(SetSctiptHub.id);
    console.log("Hub successfully scripted\n");
    compiledLottery = compile(getScriptLottery(addressHubLottery, addressAdminLottery, addressRandomizer, addressOwner))
    const SetSctiptLottery = setScript({script:compiledLottery},seedLottery)
    await broadcast(SetSctiptLottery);
    await waitForTx(SetSctiptLottery.id);
    console.log("Lottery successfully scripted");
})();