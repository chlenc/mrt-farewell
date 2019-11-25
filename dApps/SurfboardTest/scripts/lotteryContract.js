const getScriptLottery = (addressHubLottery, addressLottery, addressRandomizer, pubKeyOwner) => `
{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}

let lotteryTicketHolder = Address(base58'3MrC1oqVCoLkfHabhJtrLJS6GxcooQwRWuP')
let lotteryOwner = "3MxtzncKM9x1kKpLP3sp8WZPvg1cza8jHGm"
let ownerPubKey = base58'CBoRgqiPjXZMaoN8BwCSFfXsRX5jvNDiZ9SArkfMQX1Z'
let dAppRandomAddress = Address(base58'3Mt1uo5ieYK8Pk9XyVZp88HBLMfprrq515z')

@Callable(contextObj)
func randomRequestTxIdRecord(randomRequestTxId: String) ={
    if this.getString("randomRequestTxId").isDefined()
        then throw("randomIdTx is already in the state")
    else 
        if contextObj.caller ==  addressFromString(lotteryOwner) then
            WriteSet([DataEntry("randomRequestTxId", randomRequestTxId)])
        else
            throw("only owner can start the lottery") 
              
}

@Callable(contextObj)
func checkRandom() = {
    let randomRequestCommitedTxId= this.getStringValue("randomRequestTxId")
    let randomResponse = dAppRandomAddress.getStringValue(randomRequestCommitedTxId)
    let status = randomResponse.split("_")[0]
    let randomResult = randomResponse.split("--")[1]
    if status == "FINISHED" then
        WriteSet([
            DataEntry("randomResult", parseIntValue(randomResult))
        ])
    else throw("Incorrect random result")
    } 

@Callable(contextObj)
func defineTheWinner() = {
    let randomResult = this.getIntegerValue("randomResult")
    if lotteryTicketHolder.getInteger("winningTicket" +  toString(randomResult)).isDefined() then
        let ticketAmount = lotteryTicketHolder.getIntegerValue("ticketAmount")
        let randomResultUpdate = if ((randomResult) == ticketAmount ) then 1 else randomResult +1
        WriteSet([
            DataEntry("randomResult", randomResultUpdate)
        ])
    else
        let winnerAddress = lotteryTicketHolder.getStringValue("ticket" + toString(randomResult))
        WriteSet([
            DataEntry("winnerTicket", randomResult),
            DataEntry("winnerAddress", winnerAddress),
            DataEntry("winHeight", height)
        ])
}

@Callable(contextObj)
func withdraw() = {
    let winnerAddress = addressFromStringValue(this.getStringValue("winnerAddress"))
    let winHeight = this.getIntegerValue("winHeight")
    let ownerAddress = addressFromPublicKey(ownerPubKey)
    let month = 43200
    if (contextObj.caller == winnerAddress && height <= winHeight+month) then
        TransferSet([ScriptTransfer(winnerAddress, this.assetBalance(unit), unit)])
    else
        if ((contextObj.caller == addressFromStringValue(lotteryOwner)) && height > winHeight+month) then
             TransferSet([ScriptTransfer(ownerAddress, this.assetBalance(unit), unit)])
        else throw("you can't withdraw the funds")
}
`;
module.exports = getScriptLottery