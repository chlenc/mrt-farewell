const wvs = 10 ** 8;

describe('MRT test', async function () {

    this.timeout(100000);
    const addressHub = "3N2n8gAGHs7scFcgAGSg2jmWKjrmpiJRHRx"
    const addressLottery = "3Mt2gEtUgX2Yi4oftjKefqXKkfj7a95aJ5w"
    const seedHub = "abandon weasel mango cabin army audit hospital sock term screen hurt cycle pitch visa fault"
    const seedLottery = "advice yard seminar hour cause work flush action elite famous can belt bunker hamster require"
    
    const player = "shift never same denial female matrix student stand body hello lady crucial essay scale soldier"
    const MRTid = "8afYrbDBr6Tw5JgaWUgm2GncY7rL87JvGG7aWezWMGgZ"
    const randomTxId = "2vmvnr79De1Y9GtMM3NQfhzrbwt93UuUMCER6GbBTFsj"
    const toLeaseAddress = "3Mp1GGUhbaJVu7Eaf8bKMGr3B29GVjrketT"
    
    it('Positive scenаrio', async function () {
        params = {
            call: {
                args: [{ type: "string", value:  toLeaseAddress  }],
                function: 'buyTicket',
            },
            payment: [{amount: 3,assetId: MRTid}],
            dApp: addressHub,
            fee: 900000,
            }    
            const BuyTicketTx1 = invokeScript(params, player);
            await broadcast(BuyTicketTx1);
            await waitForTx(BuyTicketTx1.id);
            console.log("successfully buy ticket 1")

        
        params = {
            call: {
                args: [{ type: "string", value:  toLeaseAddress }],
                function: 'buyTicket',
            },
            payment: [{amount: 3,assetId: MRTid}],
            dApp: addressHub,
            fee: 900000,
            }    
        const BuyTicketTx2 = invokeScript(params, player);
        await broadcast(BuyTicketTx2);
        await waitForTx(BuyTicketTx2.id);
        console.log("successfully buy ticket 2")

        params = {
            call: {
                args: [{ type: "string", value:  randomTxId  }],
                function: 'registerRandomRequestTx',
            },
            payment: [],
            dApp: addressLottery,
            fee: 900000,
            }    
        const registerRandomRequestTx = invokeScript(params, seedLottery);
        await broadcast(registerRandomRequestTx);
        await waitForTx(registerRandomRequestTx.id);
        console.log("successfully register tx which invoke randomizer")

        params = {
                call: {
                args: [],
                function: 'checkRandom',
                },
                payment: [],
                dApp: addressLottery,
                fee: 900000,
                }
        const checkRandom = invokeScript(params, seedLottery);
        await broadcast(checkRandom);
        await waitForTx(checkRandom.id);
        console.log("random checked and written in the lottery state")
                
        params = {
                call: {
                args: [],
                function: 'defineTheWinner',
                },
                payment: [],
                dApp: addressLottery,
                fee: 900000,
                }
        const defineTheWinner = invokeScript(params, player);
        await broadcast(defineTheWinner);
        await waitForTx(defineTheWinner.id);
        console.log("winner defiend or new random value setted")

        params = {
                call: {
                args: [{type: "string", value: addressLottery, }],
                function: 'addWinner',
                },
                payment: [],
                dApp: addressHub,
                fee: 900000,
                }    
        const addWinner = invokeScript(params, player);
        await broadcast(addWinner);
        await waitForTx(addWinner.id);
        console.log("winner ticket added to hub")

        lotteryWavesBalance = await(balance(addressLottery))


        params = {
                amount: lotteryWavesBalance,
                recipient: toLeaseAddress,
                fee : 500000
            }
        const leaseTx = lease(params, player)
        await broadcast(leaseTx);
        await waitForTx(leaseTx.id);
        console.log("leaseTx succsessfully sent")     
    });

    
});