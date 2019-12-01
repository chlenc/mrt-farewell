const wvs = 10 ** 8;

describe('MRT test', async function () {

    this.timeout(100000);
    const addressHub = "3N9rYmoDXsvY2dY1Ey2e44Q2BcVXSCbT2UF"
    const addressLottery = "3MzNxkE6otE41cM8JeheYNDt7QtDJrUqh9K"
    //const seedHub = "entry monkey furnace minimum phone ostrich print group couch undo anxiety adapt reason evidence reason"
    //const seedLottery = "inch broom wheel heavy advice window kid mistake yard good flower cinnamon viable social valley"
    const player = "shift never same denial female matrix student stand body hello lady crucial essay scale soldier"
    const MRTid = "8afYrbDBr6Tw5JgaWUgm2GncY7rL87JvGG7aWezWMGgZ"
    const randomTxId = "2vmvnr79De1Y9GtMM3NQfhzrbwt93UuUMCER6GbBTFsj"

    const lotteryAdminSeed = "shift never same denial female matrix student stand body hello lady crucial essay scale soldier"
    it('Positive scenаrio', async function () {
        params = {
            call: {
                args: [],
                function: 'buyTicket',
            },
            payment: [{amount: 9,assetId: MRTid}],
            dApp: addressHub,
            fee: 900000,
            }    
        const BuyTicketTx1 = invokeScript(params, player);
        //await broadcast(BuyTicketTx1);
        //await waitForTx(BuyTicketTx1.id);
        //console.log("successfully buy ticket 1")

        
        params = {  
            call: {
                args: [],
                function: 'buyTicket',
            },
            payment: [{amount: 3,assetId: MRTid}],
            dApp: addressHub,
            fee: 900000,
            }    
        const BuyTicketTx2 = invokeScript(params, player);
        //await broadcast(BuyTicketTx2);
        //await waitForTx(BuyTicketTx2.id);
        //console.log("successfully buy ticket 2")

        params = {
            call: {
                args: [],
                function: 'buyTicket',
            },
            payment: [{amount: 3,assetId: MRTid}],
            dApp: addressHub,
            fee: 900000,
            }    
        const BuyTicketTx3 = invokeScript(params, player);
        //await broadcast(BuyTicketTx3);
        //await waitForTx(BuyTicketTx3.id);
        //console.log("successfully buy ticket 3")

        params = {
            call: {
                args: [{ type: "string", value:  randomTxId  }],
                function: 'registerRandomRequestTx',
            },
            payment: [],
            dApp: addressLottery,
            fee: 900000,
            }    
        const registerRandomRequestTx = invokeScript(params, lotteryAdminSeed);
        await broadcast(registerRandomRequestTx);
        await waitForTx(registerRandomRequestTx.id);
        console.log("successfully register tx which invoke randomizer")
                
        params = {
                call: {
                args: [{ type: "string", value:  "ticketsFrom1To3" }],
                function: 'defineTheWinner',
                },
                payment: [],
                dApp: addressLottery,
                fee: 900000,
                }
        const defineTheWinner = invokeScript(params, lotteryAdminSeed);
        await broadcast(defineTheWinner);
        await waitForTx(defineTheWinner.id);
        console.log("winner defiend or new random value setted")

        params = {
                call: {
                args: [{type: "string", value:  addressLottery }],
                function: 'addWinner',
                },
                payment: [],
                dApp: addressHub,
                fee: 900000,
                }    
        const addWinner = invokeScript(params, lotteryAdminSeed);
        await broadcast(addWinner);
        await waitForTx(addWinner.id);
        console.log("winner ticket added to hub")


        params = {
            call: {
            args: [],
            function: 'withdraw',
            },
            payment: [],
            dApp: addressLottery,
            fee: 900000,
            }    
        const withdrawByWinner = invokeScript(params, player);
        //await broadcast(withdrawByWinner);
        //await waitForTx(withdrawByWinner.id);
        console.log("successfully withdrawn")
    });
});