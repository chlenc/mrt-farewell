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
        console.log(`InitDraw transaction id ${initDrawTx.id}`)

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
        await broadcastAndWaitTx(invokeScript({
            fee: 500000,
            dApp: addressRandomizer,
            chainId: 'W',
            call: {function: "ready", args: [{"type": "string", "value": initDrawTx.id}]}
        }, adminSeed));
        console.log(`Ready transaction success`);

        //Sleep 20 sec
        console.log('Start sleep 20 sec');
        await timeout(20 * 1e3);
        console.log('Wake up after 20 sec sleeping');

        //Get random value from state
        const randomData = await accountDataByKey(initDrawTx.id, addressRandomizer, mainNodeUrl);
        console.log(`Random data:${randomData}`);

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
            return from >= randomNumber && to <= randomNumber
        });
        console.log(`Winner: ${winnerButch[1].key} ${winnerButch[1].value}`);

        let i = 0;
        // while (true) {
        //     i++;
        //     if (i > 5) {
        //         const defineTheWinnerTx = invokeScript({
        //             fee: 500000,
        //             dApp: lotteryAddress,
        //             call: {
        //                 function: "defineTheWinner",
        //                 args: [{"type": "string", "value": winnerButch.key}]
        //             },
        //             payment: null
        //         }, adminSeedTest);
        //
        //         await timeout(1e3);
        //     }
        //     break;
        // }

    }


    //
    //         const urlWinnerAddress = `https://nodes.wavesnodes.com/addresses/data/${lotteryAddress}/winnerAddress`;
    //
    //
    //         promise = new Promise(async function (resolve, reject) {
    //             const defineTheWinnerTx = invokeScript({
    //                 fee: 500000,
    //                 dApp: lotteryAddress,
    //                 call: {
    //                     function: "defineTheWinner",
    //                     args: [{"type": "string", "value": winnerButch.key}]
    //                 },
    //                 payment: null
    //             }, adminSeedTest);
    //
    //             console.log('defineTheWinner timeout')
    //
    //             await broadcast(defineTheWinnerTx, nodeUrl);
    //             await waitForTx(defineTheWinnerTx.id);
    //             const resp = await (await fetch(urlWinnerAddress)).json();
    //             if (!resp.error) {
    //                 resolve('winner defined')
    //             }
    //         });
    //
    //         result = await promise
    //
    //         console.log(result)
    //
    //         const addWinner = invokeScript({
    //             call: {
    //                 args: [{type: "string", value: lotteryAddress}],
    //                 function: 'addWinner',
    //             },
    //             dApp: hubAddress,
    //             payment: null,
    //             fee: 900000,
    //         }, adminSeedTest);
    //         await broadcast(addWinner, nodeUrl);
    //         await waitForTx(addWinner.id);
    //         console.log('done')
    //
    // }

})();

