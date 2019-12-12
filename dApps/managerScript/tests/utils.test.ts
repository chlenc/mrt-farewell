import { mainNodeUrl } from "../utils";
import { accountDataByKey } from "@waves/waves-transactions/dist/nodeInteraction";

test('test define winner', async () => {

    console.log(await accountDataByKey('winnerAddress', '3PAo9fetgN4XiwWMj7Kqpz9r3tgZtcUigUi', mainNodeUrl))
    console.log(await accountDataByKey('winnerAddress', '3PNBHVNaU3tmfJaEQ9y4TvziPUqteX8jJRF', mainNodeUrl))
});

