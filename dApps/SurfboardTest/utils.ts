import { broadcast} from "@waves/waves-transactions";
import { waitForTx } from "@waves/waves-transactions";

export const testNodeUrl = 'https://testnodes.wavesnodes.com';
export const mainNodeUrl = 'https://nodes.wavesnodes.com';
export const sec = 1e3;

export const broadcastAndWaitTx = async (tx, node: "testnet" | "mainnet" = 'testnet') => {
    try {
        const apiBase = node === 'testnet' ? testNodeUrl : mainNodeUrl;
        await broadcast(tx, apiBase);
        await waitForTx(tx.id, {apiBase})
    } catch (e) {
        console.error(e);
        throw e
    }
};


export function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
