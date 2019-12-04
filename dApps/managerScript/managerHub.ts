import { setScript, transfer } from "@waves/waves-transactions";
import { broadcastAndWaitTx } from "../SurfboardTest/utils";
import { compile } from "@waves/ride-js";
import { address, randomSeed } from "@waves/ts-lib-crypto";

const getScriptHub = require("./src/hubContract");

const seedHub = randomSeed();
const addressHub = address(seedHub, 'W');

const seedWithMoney = 'put survey assist brown matter cherry emerge camp dash window elbow around fox into elevator';
const mrtId = "4uK8i4ThRGbehENwa6MxyLtxAjAo1Rj9fduborGExarC";

(async () => {
    await broadcastAndWaitTx(transfer({amount: 1000000, recipient: addressHub, fee: 100000}, seedWithMoney), 'mainnet');
    console.log("\nHub seccessfully replanished. Hub address: ", addressHub);

    const compiledHub = compile(getScriptHub(mrtId, 100));
    if (!('result' in compiledHub)) throw "incorrect script";
    await broadcastAndWaitTx(setScript({script: compiledHub.result.base64}, seedHub), 'mainnet');
    console.log(seedHub)
})();

