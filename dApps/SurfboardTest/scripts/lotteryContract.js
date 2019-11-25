const getScriptLottery = (addressHubLottery, addressLottery, addressRandomizer, pubKeyOwner) => `
{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}

let lotteryTicketHub = Address(base58'${addressHubLottery}')
let lotteryOwner = "${addressLottery}"
let ownerPubKey = base58'${pubKeyOwner}'
let dAppRandomAddress = Address(base58'${addressRandomizer}')


@Callable(contextObj)
func registerRandomRequestTx(randomRequestTx: String) ={
    if this.getString("randomRequestTx").isDefined()
        then throw("randomRequestTx is already in the state")
    else 
    if transactionHeightById(fromBase58String(randomRequestTx)).isDefined()
        then throw("You try register tx which is already in blockchain")
    else
        if contextObj.caller ==  addressFromString(lotteryOwner) then
            WriteSet([DataEntry("randomRequestTx", randomRequestTx)])
        else
            throw("only loteryOwner can start the lottery")   
}

@Callable(contextObj)
func checkRandom() = {
    let randomRequestCommitedTxId= this.getStringValue("randomRequestTx")
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
func defineTheWinner(ticketsInHubKey: String) = {
    let randomResult = this.getIntegerValue("randomResult")
    if lotteryTicketHub.getInteger("winningTicket" +  toString(randomResult)).isDefined() then
        let ticketAmount = lotteryTicketHub.getIntegerValue("ticketAmount")
        let randomResultUpdate = if ((randomResult) == ticketAmount ) then 1 else randomResult +1
        WriteSet([
            DataEntry("randomResult", randomResultUpdate)
        ])
    else
        let ticketFrom = parseIntValue(ticketsInHubKey.split("To")[0].split("ticketsFrom")[1])
        let ticketTo= parseIntValue(ticketsInHubKey.split("To")[1])
        if ( randomResult>=ticketFrom && randomResult<=ticketTo) then
            let winnerAddress = lotteryTicketHub.getStringValue(ticketsInHubKey)
            WriteSet([
                DataEntry("winnerTicket", randomResult),
                DataEntry("winnerAddress", winnerAddress),
                DataEntry("winHeight", height)
            ])
        else throw("these tickets didn't win")
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