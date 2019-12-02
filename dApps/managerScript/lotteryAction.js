/// <reference path="../node_modules/@waves/js-test-env/index.d.ts" />
const fetch = require("node-fetch");
const {hubAddress} = require("../../lottery/src/json/constants");
const {adminSeed, addressRandomizer, seedRandomizerTest, adminSeedTest} = require('./secureJson');
const lotteryInfo = require("../../lottery/src/json/lotteries");

(async () => {
    const url = `https://testnode1.wavesnodes.com/addresses/data/${hubAddress}/ticketAmountTotal`;
    const {value: ticketAmount} = await (await fetch(url)).json();

    // const rafflePeriodTx = data({
    //     data:[{key: "status", value: "raffle"}],
    //     fee: 500000
    // },require('./hubInfo.json').seed);
    // await broadcast(rafflePeriodTx);
    // await waitForTx(rafflePeriodTx.id);

    for (const {address: lotteryAddress} of lotteryInfo) {

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
            payment: [
                {
                    "amount": 16700000,
                    "assetId": null
                }
            ]
        }, adminSeed);


        const initDrawTxId = "4byYHyib2VHakdC4QnD14qbmKsmhWh3vd5shuFkkLgEB" //initDrawTx.id;
        const registerRandomRequestTx = invokeScript({
            fee: 500000,
            dApp: lotteryAddress,
            call: {
                function: "registerRandomRequestTx",
                args: [
                    {"type": "string", "value": initDrawTxId},
                ]
            },
            payment: null
        }, adminSeedTest);
        //await broadcast(registerRandomRequestTx);
        //await waitForTx(registerRandomRequestTx.id);
        console.log(registerRandomRequestTx)
        console.log(initDrawTx.id)
        //await broadcast(initDrawTx, 'https://nodes.wavesnodes.com');
        //await waitForTx(initDrawTx.id);
        //console.log('initDrawTx')

        const urlRanomizer = `https://nodes.wavesnodes.com/addresses/data/${addressRandomizer}/${initDrawTxId}`;
        let randomValue, randomKey;

        let promise = new Promise(function (resolve, reject) {
            setTimeout(async () => {
                const resp = await (await fetch(urlRanomizer)).json();
                console.log('Ranomizer timeout')
                console.log(resp)
                if (!resp.error) {
                    console.log('Ranomizer defined')
                    resolve(resp)

                }
            }, 1000);
        });

        let result = await promise

        console.log([result])

        const dataTx = data({data: [result], fee: 500000}, seedRandomizerTest);
        await broadcast(dataTx);
        await waitForTx(dataTx.id);
        console.log('send defined to RandomizerTest')

        const randomNumber = result.value.split('--').pop();
        console.log(randomNumber)

        const hubStateUrl = `https://testnode1.wavesnodes.com/addresses/data/${hubAddress}`;
        const state = await (await fetch(hubStateUrl)).json();
        console.log('get hub state success')

        const winnerButch = state.find(({key}) => {
            const [from, to] = key.replace('ticketsFrom', '').split('To');
            return from >= randomNumber && to <= randomNumber
        });
        console.log(winnerButch)

        const urlWinnerAddress = `https://nodes.wavesnodes.com/addresses/data/${lotteryAddress}/winnerAddress`;


        promise = new Promise(async function (resolve, reject) {
            const defineTheWinnerTx = invokeScript({
                fee: 500000,
                dApp: lotteryAddress,
                call: {
                    function: "defineTheWinner",
                    args: [{"type": "string", "value": winnerButch.key}]
                },
                payment: null
            }, adminSeedTest);

            console.log('defineTheWinner timeout')

            await broadcast(defineTheWinnerTx);
            await waitForTx(defineTheWinnerTx.id);
            const resp = await (await fetch(urlWinnerAddress)).json();
            if (!resp.error) {
                resolve('winner defined')
            }
        });

        result = await promise

        console.log(result)

        const addWinner = invokeScript({
            call: {
                args: [{type: "string", value: lotteryAddress}],
                function: 'addWinner',
            },
            dApp: hubAddress,
            payment: null,
            fee: 900000,
        }, adminSeedTest);
        await broadcast(addWinner);
        await waitForTx(addWinner.id);
        console.log('done')

    }

})();

