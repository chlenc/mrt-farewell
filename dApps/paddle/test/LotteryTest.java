import im.mak.paddle.Account;
import im.mak.paddle.api.StateChanges;
import im.mak.paddle.api.deser.ScriptTransfer;
import im.mak.paddle.exceptions.NodeError;
import org.junit.jupiter.api.*;

import static im.mak.paddle.Async.async;
import static im.mak.paddle.Node.node;
import static im.mak.paddle.actions.invoke.Arg.arg;
import static im.mak.paddle.actions.mass.Recipient.to;
import static im.mak.paddle.util.Script.fromFile;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LotteryTest {

    private Account owner, admin, oracle, hub, lottery1, lottery2, lottery3, player1, player2, player3;
    private String MRT;
    private String randTxId1 = "2vmvnr79De1Y9GtMM3NQfhzrbwt93UuUMCER6GbBTFsj";
    private String randTxId2 = "jsFTBbG6RECMUuU39twbrzhfQN3MMtG9Y1eD97rnvmv2";
    private String randTxId3 = "zrbwt93UuUMCER6GbBTFsj2vmvnr79De1Y9GtMM3NQfh";
    private int regTx1Height, regTx2Height, regTx3Height;
    private int withdrawPeriod = 3;

    @BeforeAll
    void before() {
        async(
                ()-> {
                    owner = new Account("owner", 100_00000000L);
                    MRT = owner.issues(i -> i.quantity(10000000).decimals(2)).getId().toString();
                },
                ()-> admin = new Account(1_00000000),
                ()-> oracle = new Account(1_00000000),
                ()-> hub = new Account(1_00000000),
                ()-> lottery1 = new Account(1_00000000),
                ()-> lottery2 = new Account(1_00000000),
                ()-> lottery3 = new Account(1_00000000),
                ()-> player1 = new Account(1_00000000),
                ()-> player2 = new Account(1_00000000),
                ()-> player3 = new Account(1_00000000)
        );
        async(
                () -> owner.massTransfers(t -> t.asset(MRT).recipients(
                        to(player1, 1000000),
                        to(player2, 1000000),
                        to(player3, 1000000))),
                () -> hub.writes(d -> d
                        .string("mrt_id", MRT)
                        .string("address_owner", owner.address())
                        .string("address_admin", admin.address())
                        .string("address_oracle", oracle.address())
                        .integer("withdraw_period", withdrawPeriod)
                        .bool("lottery_" + lottery1.address(), true)
                        .bool("lottery_" + lottery2.address(), true)
                        .bool("lottery_" + lottery3.address(), true)
                ),
                () -> lottery1.writes(d -> d.string("address_hub", hub.address())),
                () -> lottery2.writes(d -> d.string("address_hub", hub.address())),
                () -> lottery3.writes(d -> d.string("address_hub", hub.address())),
                () -> oracle.writes(d -> d
                        .string(randTxId1, "INIT_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_")
                        .string(randTxId2, "INIT_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_")
                        .string(randTxId3, "INIT_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_"))
        );
        async(
                () -> hub.setsScript(s -> s.script(fromFile("../lotteryHub.ride"))),
                () -> lottery1.setsScript(s -> s.script(fromFile("../lottery.ride"))),
                () -> lottery2.setsScript(s -> s.script(fromFile("../lottery.ride"))),
                () -> lottery3.setsScript(s -> s.script(fromFile("../lottery.ride")))
        );
    }

    @Test @Order(0)
    @DisplayName("Users can't buy tickets before the Hub status")
    void cantBuyTicketsBeforeStart() {
        assertThat(assertThrows(NodeError.class, () ->
                player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(39999, MRT))
        )).hasMessageContaining("extract() called on unit value");
    }

    @Test @Order(1)
    @DisplayName("Users can buy tickets at appropriate Hub status")
    void buyTickets() {
        hub.writes(d -> d.string("status", "ticketingPeriod"));

        player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(39999, MRT));
        player2.invokes(i -> i.dApp(hub).function("buyTicket").payment(10000, MRT));
        player3.invokes(i -> i.dApp(hub).function("buyTicket").payment(10001, MRT));

        assertThat(hub.dataInt("ticketAmountTotal")).isEqualTo(5);
        assertThat(hub.dataStr("ticketsFrom1To3")).isEqualTo(player1.address());
        assertThat(hub.dataStr("ticketsFrom4To4")).isEqualTo(player2.address());
        assertThat(hub.dataStr("ticketsFrom5To5")).isEqualTo(player3.address());
        assertThat(hub.data()).hasSize(9 + 4);
    }

    @Test @Order(2)
    @DisplayName("Hub can't buy own tickets")
    void hubCantBuyTickets() {
        assertThat(assertThrows(NodeError.class, () ->
                hub.invokes(i -> i.dApp(hub).function("buyTicket").payment(10000, MRT))
        )).hasMessageContaining("ticket hub can't call this function");
    }

    @Test @Order(3)
    @DisplayName("Players can't buy tickets after appropriate Hub status")
    void cantBuyTicketsAfterStatus() {
        hub.writes(d -> d.string("status", "finished"));

        assertThat(assertThrows(NodeError.class, () ->
                player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(10000, MRT))
        )).hasMessageContaining("It isn't ticketing period");
    }

    @Test @Order(4)
    @DisplayName("Admin can register each random only once")
    void eachRandomOnlyOnce() {
        regTx1Height = admin.invokes(i -> i
                .dApp(lottery1).function("registerRandomRequestTx", arg(randTxId1))
        ).getHeight();

        assertThat(lottery1.dataStr("randomRequestTx")).isEqualTo(randTxId1);
        assertThat(lottery1.dataInt("startHeight")).isEqualTo(regTx1Height);
        assertThat(lottery1.data()).hasSize(1 + 2);

        assertThat(assertThrows(NodeError.class, () ->
                admin.invokes(i -> i.dApp(lottery1).function("registerRandomRequestTx", arg(randTxId2)))
        )).hasMessageContaining("randomRequestTx is already in the state");

        regTx2Height = admin.invokes(i -> i
                .dApp(lottery2).function("registerRandomRequestTx", arg(randTxId2))
        ).getHeight();

        assertThat(lottery2.dataStr("randomRequestTx")).isEqualTo(randTxId2);
        assertThat(lottery2.dataInt("startHeight")).isEqualTo(regTx2Height);
        assertThat(lottery2.data()).hasSize(1 + 2);

        regTx3Height = admin.invokes(i -> i
                .dApp(lottery3).function("registerRandomRequestTx", arg(randTxId3))
        ).getHeight();

        assertThat(lottery3.dataStr("randomRequestTx")).isEqualTo(randTxId3);
        assertThat(lottery3.dataInt("startHeight")).isEqualTo(regTx3Height);
        assertThat(lottery3.data()).hasSize(1 + 2);
    }

    @Test @Order(5)
    @DisplayName("Can't define a winner before random reveal")
    void cantDefineWinnerBeforeReveal() {
        assertThat(assertThrows(NodeError.class, () ->
                admin.invokes(i -> i.dApp(lottery1).function("defineTheWinner", arg("ticketsFrom1To3")))
        )).hasMessageContaining("Index 1 out of bounds for length 1");
    }

    @Test @Order(6)
    @DisplayName("Can't register undefined winner in the Hub")
    void cantRegisterUnknownWinner() {
        assertThat(assertThrows(NodeError.class, () ->
                admin.invokes(i -> i.dApp(hub).function("addWinner", arg(lottery1.address())))
        )).hasMessageContaining("extract() called on unit value");
    }

    @Test @Order(7)
    @DisplayName("Anyone can define first winner")
    void define1stWinner() {
        oracle.writes(d -> d.string(randTxId1, "FINISHED_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_--3"));

        player3.invokes(i -> i.dApp(lottery1).function("defineTheWinner", arg("ticketsFrom1To3")));

        assertThat(lottery1.dataInt("winnerTicket")).isEqualTo(3);
        assertThat(lottery1.dataStr("winnerAddress")).isEqualTo(player1.address());
        assertThat(lottery1.data()).hasSize(3 + 2);
    }

    @Test @Order(8)
    @DisplayName("Anyone can register the first winner in Hub")
    void canRegister1stWinnerInHub() {
        player2.invokes(i -> i.dApp(hub).function("addWinner", arg(lottery1.address())));

        assertThat(hub.dataStr("winningTicket" + 3)).isEqualTo(player1.address());
        assertThat(hub.data()).hasSize(13 + 1);
    }

    @Test @Order(9)
    @DisplayName("Admin can define second winner")
    void define2ndWinner() {
        oracle.writes(d -> d.string(randTxId2, "FINISHED_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_--3"));

        admin.invokes(i -> i.dApp(lottery2).function("defineTheWinner", arg("ticketsFrom1To3")));

        assertThat(lottery2.dataInt("randomResult")).isEqualTo(4);
        assertThat(lottery2.data()).hasSize(3 + 1);

        admin.invokes(i -> i.dApp(lottery2).function("defineTheWinner", arg("ticketsFrom4To4")));

        assertThat(lottery2.dataInt("winnerTicket")).isEqualTo(4);
        assertThat(lottery2.dataStr("winnerAddress")).isEqualTo(player2.address());
        assertThat(lottery2.data()).hasSize(4 + 2);
    }

    @Test @Order(10)
    @DisplayName("Admin can register the second winner in Hub")
    void canRegister2ndWinnerInHub() {
        admin.invokes(i -> i.dApp(hub).function("addWinner", arg(lottery2.address())));

        assertThat(hub.dataStr("winningTicket" + 4)).isEqualTo(player2.address());
        assertThat(hub.data()).hasSize(14 + 1);
    }

    @Test @Order(11)
    @DisplayName("Admin can define third winner")
    void define3rdWinner() {
        oracle.writes(d -> d.string(randTxId3, "FINISHED_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_--3"));

        admin.invokes(i -> i.dApp(lottery3).function("defineTheWinner", arg("ticketsFrom1To3")));

        assertThat(lottery3.dataInt("randomResult")).isEqualTo(4);
        assertThat(lottery3.data()).hasSize(3 + 1);

        admin.invokes(i -> i.dApp(lottery3).function("defineTheWinner", arg("ticketsFrom4To4")));

        assertThat(lottery3.dataInt("randomResult")).isEqualTo(5);
        assertThat(lottery3.data()).hasSize(3 + 1);

        admin.invokes(i -> i.dApp(lottery3).function("defineTheWinner", arg("ticketsFrom5To5")));

        assertThat(lottery3.dataInt("winnerTicket")).isEqualTo(5);
        assertThat(lottery3.dataStr("winnerAddress")).isEqualTo(player3.address());
        assertThat(lottery3.data()).hasSize(4 + 2);
    }

    @Test @Order(12)
    @DisplayName("Admin can register the third winner in Hub")
    void canRegister3rdWinnerInHub() {
        admin.invokes(i -> i.dApp(hub).function("addWinner", arg(lottery3.address())));

        assertThat(hub.dataStr("winningTicket" + 5)).isEqualTo(player3.address());
        assertThat(hub.data()).hasSize(15 + 1);
    }

    @Test @Order(13)
    @DisplayName("Admin or owner can't withdraw money during period")
    void adminOrOwnerCantWithdrawMoney() {
        assertThat(assertThrows(NodeError.class, () ->
                admin.invokes(i -> i.dApp(lottery2).function("withdraw"))
        )).hasMessageContaining("you can't withdraw the funds");

        assertThat(assertThrows(NodeError.class, () ->
                owner.invokes(i -> i.dApp(lottery3).function("withdraw"))
        )).hasMessageContaining("you can't withdraw the funds");
    }

    @Test @Order(14)
    @DisplayName("Winner can withdraw money")
    void winnerCanWithdrawMoney() {
        long lotteryBalance = lottery1.balance();

        StateChanges changes = node().api.stateChanges(
                player1.invokes(i -> i.dApp(lottery1).function("withdraw")).getId().toString());

        assertThat(changes.transfers.get(0).address).isEqualTo(player1.address());
        assertThat(changes.transfers.get(0).amount).isEqualTo(lotteryBalance);
        assertThat(changes.transfers.get(0).asset).isNull();
    }

    @Test @Order(15)
    @DisplayName("Winner can't get money after withdraw period")
    void winnerCantWithdrawAfterPeriod() {
        node().waitForHeight(regTx2Height + withdrawPeriod + 1);

        assertThat(assertThrows(NodeError.class, () ->
                player2.invokes(i -> i.dApp(lottery2).function("withdraw"))
        )).hasMessageContaining("you can't withdraw the funds");
    }

    @Test @Order(16)
    @DisplayName("Admin can get money after withdraw period")
    void adminCanWithdrawAfterPeriod() {
        long lotteryBalance = lottery2.balance();

        StateChanges changes = node().api.stateChanges(
                admin.invokes(i -> i.dApp(lottery2).function("withdraw")).getId().toString());

        assertThat(changes.transfers.get(0).address).isEqualTo(owner.address());
        assertThat(changes.transfers.get(0).amount).isEqualTo(lotteryBalance);
        assertThat(changes.transfers.get(0).asset).isNull();
    }

    @Test @Order(17)
    @DisplayName("Owner can get money after withdraw period")
    void ownerCanWithdrawAfterPeriod() {
        long lotteryBalance = lottery3.balance();

        node().waitForHeight(regTx3Height + withdrawPeriod + 1);

        StateChanges changes = node().api.stateChanges(
                owner.invokes(i -> i.dApp(lottery3).function("withdraw")).getId().toString());

        assertThat(changes.transfers.get(0).address).isEqualTo(owner.address());
        assertThat(changes.transfers.get(0).amount).isEqualTo(lotteryBalance);
        assertThat(changes.transfers.get(0).asset).isNull();
    }

}
