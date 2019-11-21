const getScriptHub = (MRTid) => `
{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}
let ticketPrice = 3 #100.00 MRT,
let MRTid = base58'${MRTid}'
func getTicketAmount() = {
    match(this.getInteger("ticketAmount")) {
        case a : Int => a
        case _ => 0
    }
}

@Callable(contextObj)
func buyTicket(addresToLease: String) = {
    match(contextObj.payment) {
        case p:AttachedPayment => if ((p.amount == ticketPrice) && (p.assetId == MRTid)) then
            let ticketAmountNew = getTicketAmount() + 1
            WriteSet([
                DataEntry("ticket"+toString(ticketAmountNew), addresToLease),
                DataEntry("ticketAmount", ticketAmountNew)
                ])
        else throw("Incorrect amount or assetId in payment")
        case _ => throw("Payment not attached")}

    }   

@Callable(contextObj)
func addWinner(lottery: String) = {
        let lotteryAddress = addressFromStringValue(lottery)
        if (this.getBoolean(lottery).isDefined()) then 
            let winnerAddress = lotteryAddress.getStringValue("winnerAddress")
            let winnerTicket = lotteryAddress.getIntegerValue("winnerTicket")
            WriteSet([
                DataEntry("winningTicket"+toString(winnerTicket), winnerAddress)
            ])
        else throw("you touch incorrect lottery address")
    }
`;
module.exports = getScriptHub