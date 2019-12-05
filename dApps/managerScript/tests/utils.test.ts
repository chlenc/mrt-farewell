import { defineTheWinner } from "../lotteryAction.utils";
import { IDataEntry } from "@waves/waves-transactions";
import { testNodeUrl } from "../utils";
import { accountData } from "@waves/waves-transactions/dist/nodeInteraction";

test('test define winner', async () => {

    const hubState: Record<string, IDataEntry> = await accountData('3NCiCF2jBHM32GweYHjKG8ptb2ZLpwGgAHw', testNodeUrl);
    const randomNumber = '1';
    const lottery = '3NBKavh2dZ6VYioVmHuN3xEcykuXDU9Qp2b';

    await defineTheWinner(hubState, randomNumber,lottery);

});

