import { broadcast, waitForTx } from "@waves/waves-transactions";

export const testNodeUrl = 'https://testnodes.wavesnodes.com';
export const mainNodeUrl = 'https://nodes.wavesnodes.com';
export const sec = 1e3;

export const broadcastAndWaitTx = async (tx, node: "testnet" | "mainnet" = 'testnet', iterations = 3) => {
    const apiBase = node === 'testnet' ? testNodeUrl : mainNodeUrl;
    let success = true;
    const go = async (): Promise<boolean> => {
        try {
            await broadcast(tx, apiBase);
            await timeout(15 * sec);
            await waitForTx(tx.id, {apiBase});
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
