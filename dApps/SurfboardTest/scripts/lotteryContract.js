const getScriptLottery = (addressHubLottery, addressLottery, addressRandomizer, pubKeyOwner) => `
{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}

let lotteryTicketHolder = Address(base58'${addressHubLottery}')
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
            throw("only owner can start the lottery")   
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
            DataEntry("winnerAddress", winnerAddress)
        ])
}

@Verifier(tx)
func verify() = {
    let heightStartLease = 1
    let heightEndLease = 1000000000000
    match(tx)  {
        case l:LeaseTransaction => 
            height>heightStartLease &&
            height<heightEndLease &&
            this.getString("winnerAddress").isDefined() &&
            l.recipient == addressFromString(this.getStringValue("winnerAddress"))
        case lc:LeaseCancelTransaction => 
            height>heightEndLease &&
            sigVerify(tx.bodyBytes,tx.proofs[0],ownerPubKey)
        case t:TransferTransaction => 
            height>heightEndLease &&
            sigVerify(tx.bodyBytes,tx.proofs[0],ownerPubKey) 
        case _ => sigVerify(tx.bodyBytes,tx.proofs[0],ownerPubKey)  #!false!
    }
}
`;
module.exports = getScriptLottery