import { invokeScript } from "@waves/waves-transactions";
import { broadcastAndWaitTx } from "./utils";

const {hubAddress, ticketPrice, mrtAssetId} = require("../../lottery/src/json/constants.json");
const {adminSeed}: { [k: string]: string } = require('./src/secureJson.json');

const tickets: number[] = [1, 3, 20];

(async () => {
        for (const count of tickets) {
            await broadcastAndWaitTx(invokeScript({
                dApp: hubAddress,
                call: {function: 'buyTicket', args: []},
                chainId: "W",
                fee: 500000,
                payment: [{assetId: mrtAssetId, amount: count * ticketPrice * 100}]
            }, adminSeed));
            console.log(`Buy ${count} tickets`);
        }
    }
)();

