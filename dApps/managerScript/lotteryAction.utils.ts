import { IDataEntry, invokeScript } from "@waves/waves-transactions";
import { broadcastAndWaitTx, testNodeUrl, timeout } from "./utils";
import { accountDataByKey } from "@waves/waves-transactions/dist/nodeInteraction";
const { adminSeedTest}: { [k: string]: string } = require('./src/secureJson.json');

export async function defineTheWinner(hubState: Record<string, IDataEntry>, randomNumber: string, lotteryAddress): Promise<boolean> {

    //Find winner
    const winnerButch = Object.entries(hubState).find(([key]) => {
        if (!key.includes('ticketsFrom')) return false;
        const [from, to] = key.replace('ticketsFrom', '').split('To');

        return +from <= +randomNumber && +randomNumber <= +to
    });
    console.log(`Winner: ${winnerButch[1].key} ${winnerButch[1].value}`);

    await timeout(1e3);

    await broadcastAndWaitTx(invokeScript({
        fee: 500000,
        chainId: "T",
        dApp: lotteryAddress,
        call: {function: "defineTheWinner", args: [{type: 'string', value: winnerButch[1].key}]},
    }, adminSeedTest));

    await timeout(1e3);
    const winnerAddress = await accountDataByKey('winnerAddress', lotteryAddress, testNodeUrl);
    return winnerAddress !== null && !('error' in winnerAddress);
}
