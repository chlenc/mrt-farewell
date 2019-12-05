import { invokeScript } from "@waves/waves-transactions";
import { broadcastAndWaitTx } from "./utils";

const {hubAddress, ticketPrice, mrtAssetId} = require("../../lottery/src/json/constants.json");
const seedTest = "shift never same denial female matrix student stand body hello lady crucial essay scale soldier";

const tickets: number[] = [1, 3, 20, 100, 2000];

(async () => {
        for (const count of tickets) {
            await broadcastAndWaitTx(invokeScript({
                dApp: hubAddress,
                call: {function: 'buyTicket', args: []},
                chainId: "T",
                fee: 900000,
                payment: [{assetId: mrtAssetId, amount: count * ticketPrice * 100}]
            }, seedTest));
            console.log(`Buy ${count} tickets`);
        }
    }
)();

