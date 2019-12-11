import { broadcast, waitForTx } from "@waves/waves-transactions";

export const mainNodeUrl = 'https://nodes.wavesnodes.com';
export const sec = 1e3;

export const broadcastAndWaitTx = async (tx, iterations = 3) => {
    let success = true;
    const go = async (): Promise<boolean> => {
        try {
            await broadcast(tx, mainNodeUrl);
            await timeout(15 * sec);
            await waitForTx(tx.id, {apiBase: mainNodeUrl});
            return true
        } catch (e) {
            console.error(JSON.stringify(e, null, 4));
            return false
        }
    };
    let i = 0;
    while (true) {
        const ok = await go();
        if (ok) {
            break;
        } else if (!ok && i < iterations) {
            console.log(`recovered successfully (${i++})`);
        } else {
            success = false;
            break;
        }
    }
    if (!success) {
        console.error("Script was stopped. Please push ⌘ + c to exit.");
        while (true) {}
    }
};


export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
