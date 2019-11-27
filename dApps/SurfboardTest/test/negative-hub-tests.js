/// <reference path="../node_modules/@waves/js-test-env/index.d.ts" />
const wvs = 10 ** 8;

describe('NegativeTests', async function () {

    this.timeout(100000);
    const addressHub = "3MtUZdvG4tBEa2KeQVkn3c7pVWs9WVYW4rW"
    const addressLottery = "3MuAPdTfexi1hHG4K11kNe2p9t8CCB97J9B"
    const seedHub = "entry monkey furnace minimum phone ostrich print group couch undo anxiety adapt reason evidence reason"
    const seedLottery = "inch broom wheel heavy advice window kid mistake yard good flower cinnamon viable social valley"
    
    const player = "shift never same denial female matrix student stand body hello lady crucial essay scale soldier"
    const MRTid = "8afYrbDBr6Tw5JgaWUgm2GncY7rL87JvGG7aWezWMGgZ"
    const randomTxId = "2vmvnr79De1Y9GtMM3NQfhzrbwt93UuUMCER6GbBTFsj"
    const toLeaseAddress = "3Mp1GGUhbaJVu7Eaf8bKMGr3B29GVjrketT"
    
    it('buy for unpropriate price', async function () {
        params = {
            call: {
                args: [],
                function: 'buyTicket',
            },
            payment: [{amount: 2,assetId: MRTid}],
            dApp: addressHub,
            fee: 900000,
            }    
        const BuyTicketForMrt = invokeScript(params, player);
        expect(broadcast(BuyTicketForMrt)).to.be.rejectedWith();
        console.log("False buying ticket for 2 mrt")
    });
    it('try to add arbitrary address to hub\'s white list', async function () {
       const scumPubKey = wavesCrypto.publicKey(seedLottery)
        const paramsFotData = {
            data: [
              { key: "scum address", value: true },
            ],
            fee: 1400000,
            senderPublicKey: scumPubKey ,
          }

        const addScumAddresToHub = data(
            paramsFotData, 
            seedLottery);   
        expect(broadcast(addScumAddresToHub)).to.be.rejectedWith();
        console.log("False adding arbitrary address to hub\'s white list")

    });
});