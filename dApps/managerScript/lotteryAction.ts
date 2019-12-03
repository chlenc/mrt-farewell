import { data, IDataEntry, invokeScript, nodeInteraction } from '@waves/waves-transactions'
import { broadcastAndWaitTx, testNodeUrl, timeout } from "../SurfboardTest/utils";

const {address: addressHub, seed: seedHub} = require("./src/hubInfo.json");
const {adminSeed, addressRandomizer, seedRandomizerTest, adminSeedTest}: { [k: string]: string } = require('./src/secureJson');
const lotteryInfo = require("../../lottery/src/json/lotteries");
const nodeUrl = 'https://testnodes.wavesnodes.com';
const mainNodeUrl = 'https://testnodes.wavesnodes.com';
const {accountDataByKey, accountData} = nodeInteraction;

(async () => {

    //get ticketAmountTotal
    const {value: ticketAmount} = await accountDataByKey('ticketAmountTotal', addressHub, nodeUrl);
    console.log(`ticketAmountTotal is ${ticketAmount}`);

    // turn on raffle period
    await broadcastAndWaitTx(data({data: [{key: "status", value: "raffle"}], fee: 500000}, seedHub));
    console.log("Ticketing period successfully turned on");

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
        // await broadcastAndWaitTx(initDrawTx, "mainnet");
        console.log('Broadcast and wait initDrawTx success');

        //Broadcast and wait ready
        // await broadcastAndWaitTx(invokeScript({
        //     fee: 500000,
        //     dApp: addressRandomizer,
        //     chainId: 'W',
        //     call: {function: "ready", args: [{"type": "string", "value": initDrawTx.id}]}
        // }, adminSeed));
        // console.log(`Ready transaction success`);

        //Sleep 20 sec
        console.log('Start sleep 20 sec');
        await timeout(20 * 1e3);
        console.log('Wake up after 20 sec sleeping');

        //Get random value from state
        //const randomData = await accountDataByKey(initDrawTx.id, addressRandomizer, mainNodeUrl);
        const randomData = {key: "data", value: "1--2", type: "string"};
        console.log(`Random data:${randomData.key}: ${randomData.value}`);

        //Send random data to test randomizer
        await broadcastAndWaitTx(data({data: [randomData], fee: 500000}, seedRandomizerTest));
        console.log('Random data to test randomizer was sent');

        //Parse random data
        if (randomData.type !== "string") throw "invalid random data";
        const randomNumber = (randomData.value as string).split('--').pop();
        console.log(`Random data was parsed: ${randomNumber}`);

        //Get hub state
        const hubState: Record<string, IDataEntry> = await accountData(addressHub, testNodeUrl);
        console.log('Get hub state success');

        //Find winner
        const winnerButch = Object.entries(hubState).find(([key]) => {
            if (!key.includes('ticketsFrom')) return false;
            const [from, to] = key.replace('ticketsFrom', '').split('To');
            return +from >= +randomNumber && +randomNumber <= +to
        });
        console.log(`Winner: ${winnerButch[1].key} ${winnerButch[1].value}`);
            // console.log(+from >= +randomNumber && +randomNumber <= +to)

        //Define the winner
        while (true) {
            await broadcastAndWaitTx(invokeScript({
                fee: 500000,
                chainId: "T",
                dApp: lotteryAddress,
                call: {function: "defineTheWinner", args: [{"type": "string", "value": winnerButch[1].value}]},
            }, adminSeedTest));

            await timeout(1e3);
            const winnerAddress = await accountDataByKey('winnerAddress', lotteryAddress, testNodeUrl);
            if (!('error' in winnerAddress)) {
                break;
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
        console.log('Winner was added');
    }

})();

