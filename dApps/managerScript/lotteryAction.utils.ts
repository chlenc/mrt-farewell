import { IDataEntry, invokeScript } from "@waves/waves-transactions";
import { broadcastAndWaitTx, mainNodeUrl, timeout } from "./utils";
import { accountDataByKey } from "@waves/waves-transactions/dist/nodeInteraction";
const { adminSeed}: { [k: string]: string } = require('./src/secureJson.json');

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
        chainId: "W",
        dApp: lotteryAddress,
        call: {function: "defineTheWinner", args: [{type: 'string', value: winnerButch[1].key}]},
    }, adminSeed));

    await timeout(1e3);
    const winnerAddress = await accountDataByKey('winnerAddress', lotteryAddress, mainNodeUrl);
    return winnerAddress !== null && !('error' in winnerAddress);
}
