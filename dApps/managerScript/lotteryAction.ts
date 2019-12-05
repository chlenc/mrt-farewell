import { data, IDataEntry, invokeScript, nodeInteraction } from '@waves/waves-transactions'
import { broadcastAndWaitTx, mainNodeUrl, testNodeUrl, timeout } from "./utils";
import { defineTheWinner } from "./lotteryAction.utils";

const {address: addressHub, seed: seedHub} = require("./src/hubInfo.json");
const {adminSeed, addressRandomizer, seedRandomizerTest, adminSeedTest}: { [k: string]: string } = require('./src/secureJson.json');
const lotteryInfo = require("../../lottery/src/json/lotteries");
const {accountDataByKey, accountData} = nodeInteraction;

(async () => {

    //get ticketAmountTotal
    const {value: ticketAmount} = await accountDataByKey('ticketAmountTotal', addressHub, testNodeUrl);
    console.log(`ticketAmountTotal is ${ticketAmount}`);

    // turn on raffle period
    await broadcastAndWaitTx(data({data: [{key: "status", value: "raffle"}], fee: 600000}, seedHub));
    console.log("Raffle period successfully turned on\n");

    for (const {address: lotteryAddress} of lotteryInfo) {

        // init invokeScript initDraw
        const initDrawTx = invokeScript({
            fee: 500000,
            dApp: addressRandomizer,
            chainId: 'W',
            call: {
                function: "initDraw",
                args: [
                    {"type": "integer", "value": 1},
                    {"type": "integer", "value": ticketAmount},
                    {"type": "integer", "value": 1},
                ]
            },
            payment: [{amount: 16700000}]
        }, adminSeed);
        console.log(`InitDraw transaction id ${initDrawTx.id}`);

        //Broadcast register random request
        await broadcastAndWaitTx(invokeScript({
            fee: 500000,
            chainId: 'T',
            dApp: lotteryAddress,
            call: {
                function: "registerRandomRequestTx",
                args: [
                    {"type": "string", "value": initDrawTx.id},
                ]
            },
            payment: null
        }, adminSeedTest));
        console.log(`Broadcast register random request success`);

        //Broadcast and wait initDrawTx
        await broadcastAndWaitTx(initDrawTx, "mainnet");
        console.log('Broadcast and wait initDrawTx success');

        //Broadcast and wait ready
        await broadcastAndWaitTx(invokeScript({
            fee: 500000,
            dApp: addressRandomizer,
            chainId: 'W',
            call: {function: "ready", args: [{"type": "string", "value": initDrawTx.id}]}
        }, adminSeed), 'mainnet');
        console.log(`Ready transaction success`);

        //Sleep 20 sec
        console.log('Start sleep 20 sec');
        await timeout(20 * 1e3);
        console.log('Wake up after 20 sec sleeping');

        //Get random value from state
        const randomData = await accountDataByKey(initDrawTx.id, addressRandomizer, mainNodeUrl);
        // const randomData = {key: initDrawTx.id, value: `1--${Math.floor(1 + Math.random() * ((+ticketAmount+1) + 1 - 1))}`, type: "string"};
        console.log(`Random data:${randomData.key}: ${randomData.value}`);

        //Send random data to test randomizer
        await broadcastAndWaitTx(data({data: [randomData], fee: 500000}, seedRandomizerTest));
        console.log('Random data to test randomizer was sent');

        //Parse random data
        if (randomData.type !== "string") throw "invalid random data";
        let randomNumber = (randomData.value as string).split('--').pop();
        console.log(`Random data was parsed: ${randomNumber}`);

        //Get hub state
        const hubState: Record<string, IDataEntry> = await accountData(addressHub, testNodeUrl);
        console.log('Get hub state success');

        //Define the winner
        while (true) {
            const success = await defineTheWinner(hubState, randomNumber, lotteryAddress);
            if (success) break;
            else {
                const {value} = await accountDataByKey('randomResult', lotteryAddress, testNodeUrl);
                if(typeof value === "number") randomNumber = String(value);
                else throw 'invalid random number'
            }
        }
        console.log('Winner was defined');


        //Add the winner
        await broadcastAndWaitTx(invokeScript({
            call: {args: [{type: "string", value: lotteryAddress}], function: 'addWinner'},
            dApp: addressHub,
            chainId: "T",
            fee: 900000,
        }, adminSeedTest));
        console.log('Winner was added\n');
    }

})();

