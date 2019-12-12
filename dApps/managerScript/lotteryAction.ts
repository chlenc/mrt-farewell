import { IDataEntry, invokeScript, nodeInteraction } from '@waves/waves-transactions'
import { broadcastAndWaitTx, mainNodeUrl, timeout } from "./utils";
import { defineTheWinner } from "./lotteryAction.utils";

const {address: addressHub, seed: seedHub} = require("./src/hubInfo.json");
const {adminSeed, addressRandomizer}: { [k: string]: string } = require('./src/secureJson.json');
const lotteryInfo = require("../../lottery/src/json/lotteries.json");
const {accountDataByKey, accountData} = nodeInteraction;

(async () => {
    //get ticketAmountTotal
    const {value: ticketAmount} = await accountDataByKey('ticketAmountTotal', addressHub, mainNodeUrl);
    console.log(`ticketAmountTotal is ${ticketAmount}`);

    // turn on raffle period
    //await broadcastAndWaitTx(data({data: [{key: "status", value: "raffle"}], fee: 600000}, seedHub));
    console.log("Raffle period successfully turned on\n");

    for (const {address: lotteryAddress} of lotteryInfo) {

        if (await accountDataByKey('winnerAddress', lotteryAddress, mainNodeUrl) !== null) {
            console.log(lotteryAddress, 'skipped');
            continue;
        }

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


        const randomRequestField = await accountDataByKey('randomRequestTx', lotteryAddress, mainNodeUrl)
        if (randomRequestField !== null) {
            initDrawTx.id = (randomRequestField.value as string)
        }else {

            //Broadcast register random request
            await broadcastAndWaitTx(invokeScript({
                fee: 500000,
                chainId: 'W',
                dApp: lotteryAddress,
                call: {
                    function: "registerRandomRequestTx",
                    args: [
                        {"type": "string", "value": initDrawTx.id},
                    ]
                },
                payment: null
            }, adminSeed));
            console.log(`Broadcast register random request success`);

            //Broadcast and wait initDrawTx
            await broadcastAndWaitTx(initDrawTx);
            console.log('Broadcast and wait initDrawTx success');

            //Broadcast and wait ready
            await broadcastAndWaitTx(invokeScript({
                fee: 500000,
                dApp: addressRandomizer,
                chainId: 'W',
                call: {function: "ready", args: [{"type": "string", "value": initDrawTx.id}]}
            }, adminSeed));
            console.log(`Ready transaction success`);
        }

        //Sleep 20 sec
        console.log('Start sleep 85 sec');
        await timeout(20 * 1e3);
        // await timeout(85 * 1e3);
        console.log('Wake up after 85 sec sleeping');

        let randomNumber = null;
        while (true) {
            //Get random value from state
            const randomData = await accountDataByKey(initDrawTx.id, addressRandomizer, mainNodeUrl);
            console.log(`Random data:${randomData.key}: ${randomData.value}`);

            //Parse random data
            if (randomData.type !== "string") throw "invalid random data";
            randomNumber = (randomData.value as string).split('--').pop();
            console.log(`Random data was parsed: ${randomNumber}`);

            if (!isNaN(+randomNumber)) {
                break;
            } else {
                await timeout(20 * 1e3);
            }
        }


        //Get hub state
        const hubState: Record<string, IDataEntry> = await accountData(addressHub, mainNodeUrl);
        console.log('Get hub state success');

        //Define the winner
        while (true) {
            const success = await defineTheWinner(hubState, randomNumber, lotteryAddress);
            if (success) break;
            else {
                const {value} = await accountDataByKey('randomResult', lotteryAddress, mainNodeUrl);
                if (typeof value === "number") randomNumber = String(value);
                else throw 'invalid random number'
            }
        }
        console.log('Winner was defined');


        //Add the winner
        await broadcastAndWaitTx(invokeScript({
            call: {args: [{type: "string", value: lotteryAddress}], function: 'addWinner'},
            dApp: addressHub,
            chainId: "W",
            fee: 900000,
        }, adminSeed));
        console.log('Winner was added\n');
    }

})();

