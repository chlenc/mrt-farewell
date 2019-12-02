const getScriptHub = (MRTid) => `
{-# STDLIB_VERSION 3 #-}
{-# CONTENT_TYPE DAPP #-}
{-# SCRIPT_TYPE ACCOUNT #-}
let ticketPrice = 3 #100.00 MRT,
let MRTid = base58'${MRTid}'

func getTicketAmount() = {
    match(this.getInteger("ticketAmountTotal")) {
        case a : Int => a
        case _ => 0
    }
}

@Callable(contextObj)
func buyTicket() = {
    if contextObj.caller == this then throw("ticket hub can't call this function") 
    else
        if this.getStringValue("status") == "ticketingPeriod" then
            match(contextObj.payment) {       
                case p:AttachedPayment => if ((p.amount >= ticketPrice) && (p.assetId == MRTid)) then
                    let ticketsBuyingAmount = p.amount/ticketPrice
                    let ticketAmountTotalCurrent = getTicketAmount()
                    let ticketAmountTotalNew = ticketAmountTotalCurrent+ ticketsBuyingAmount
                    let ticketsFrom = toString(ticketAmountTotalCurrent+1)
                    let ticketsTo = toString(ticketAmountTotalCurrent+ticketsBuyingAmount)
                    let caller = toString(contextObj.caller)
                    WriteSet([
                        DataEntry("ticketsFrom"+ticketsFrom+"To"+ticketsTo, caller),
                        DataEntry("ticketAmountTotal", ticketAmountTotalNew)
                        ])
                else throw("Incorrect amount or assetId in payment")
                case _ => throw("Payment not attached")}
        else
            throw("It isn't ticketing period")
    } 

@Callable(contextObj)
func addWinner(lottery: String) = {
        let lotteryAddress = addressFromStringValue(lottery)
        if (this.getBoolean("lottery_" +lottery).isDefined()) then 
            let winnerAddress = lotteryAddress.getStringValue("winnerAddress")
            let winnerTicket = lotteryAddress.getIntegerValue("winnerTicket")
            WriteSet([
                DataEntry("winningTicket"+toString(winnerTicket), winnerAddress)
            ])
        else throw("you touch incorrect lottery address")
    }
`;
module.exports = getScriptHub