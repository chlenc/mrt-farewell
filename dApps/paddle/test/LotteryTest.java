import im.mak.paddle.Account;
import im.mak.paddle.exceptions.NodeError;
import org.junit.jupiter.api.*;

import static im.mak.paddle.Async.async;
import static im.mak.paddle.actions.invoke.Arg.arg;
import static im.mak.paddle.actions.mass.Recipient.to;
import static im.mak.paddle.util.Script.fromFile;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LotteryTest {

    private Account owner, admin, oracle, hub, lottery1, lottery2, player1, player2;
    private String MRT;
    private String randTxId1 = "2vmvnr79De1Y9GtMM3NQfhzrbwt93UuUMCER6GbBTFsj";
    private String randTxId2 = "jsFTBbG6RECMUuU39twbrzhfQN3MMtG9Y1eD97rnvmv2";
    private long player1InitBalance, player2InitBalance;

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
                ()-> player1 = new Account(1_00000000),
                ()-> player2 = new Account(1_00000000)
        );
        async(
                () -> owner.massTransfers(t -> t.asset(MRT)
                        .recipients(to(player1, 1000000), to(player2, 1000000))),
                () -> hub.writes(d -> d
                        .string("mrt_id", MRT)
                        .string("address_owner", owner.address())
                        .string("address_admin", admin.address())
                        .string("address_oracle", oracle.address())
                        .integer("withdraw_period", 3)
                        .bool("lottery_" + lottery1.address(), true)
                        .bool("lottery_" + lottery2.address(), true)
                ),
                () -> lottery1.writes(d -> d.string("address_hub", hub.address())),
                () -> lottery2.writes(d -> d.string("address_hub", hub.address())),
                () -> oracle.writes(d -> d
                        .string(randTxId1, "INIT_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_")
                        .string(randTxId2, "INIT_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_"))
        );
        async(
                () -> hub.setsScript(s -> s.script(fromFile("../lotteryHub.ride"))),
                () -> lottery1.setsScript(s -> s.script(fromFile("../lottery.ride"))),
                () -> lottery2.setsScript(s -> s.script(fromFile("../lottery.ride")))
        );

        player1InitBalance = player1.balance();
        player2InitBalance = player2.balance();
        System.out.println("init player1 balance: " + player1InitBalance);
        System.out.println("init player2 balance: " + player2InitBalance);
    }

    @Test @Order(0)
    @DisplayName("Users can't buy tickets before the Hub status")
    void cantBuyTicketsBeforeStart() {
        assertThat(assertThrows(NodeError.class,
                () -> player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(39999, MRT))
        )).hasMessageContaining("extract() called on unit value");
    }

    @Test @Order(1)
    @DisplayName("Users can buy tickets at appropriate Hub status")
    void buyTickets() {
        hub.writes(d -> d.string("status", "ticketingPeriod"));

        player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(39999, MRT));
        player2.invokes(i -> i.dApp(hub).function("buyTicket").payment(10000, MRT));
        player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(10001, MRT));

        assertThat(hub.dataInt("ticketAmountTotal")).isEqualTo(5);
        assertThat(hub.dataStr("ticketsFrom1To3")).isEqualTo(player1.address());
        assertThat(hub.dataStr("ticketsFrom4To4")).isEqualTo(player2.address());
        assertThat(hub.dataStr("ticketsFrom5To5")).isEqualTo(player1.address());
        assertThat(hub.data()).hasSize(8 + 4);
    }

    @Test @Order(2)
    @DisplayName("Hub can't buy own tickets")
    void hubCantBuyTickets() {
        assertThat(assertThrows(NodeError.class,
                () -> hub.invokes(i -> i.dApp(hub).function("buyTicket").payment(10000, MRT))
        )).hasMessageContaining("ticket hub can't call this function");
    }

    @Test @Order(3)
    @DisplayName("Players can't buy tickets after appropriate Hub status")
    void cantBuyTicketsAfterStatus() {
        hub.writes(d -> d.string("status", "finished"));

        assertThat(assertThrows(NodeError.class,
                () -> player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(10000, MRT))
        )).hasMessageContaining("It isn't ticketing period");
    }

    @Test @Order(4)
    @DisplayName("Admin can register each random only once")
    void eachRandomOnlyOnce() {
        int regTx1Height = admin.invokes(i -> i
                .dApp(lottery1).function("registerRandomRequestTx", arg(randTxId1))
        ).getHeight();

        assertThat(lottery1.dataStr("randomRequestTx")).isEqualTo(randTxId1);
        assertThat(lottery1.dataInt("startHeight")).isEqualTo(regTx1Height);
        assertThat(lottery1.data()).hasSize(1 + 2);

        assertThat(assertThrows(NodeError.class,
                () -> admin.invokes(i -> i.dApp(lottery1).function("registerRandomRequestTx", arg(randTxId2)))
        )).hasMessageContaining("randomRequestTx is already in the state");

        int regTx2Height = admin.invokes(i -> i
                .dApp(lottery2).function("registerRandomRequestTx", arg(randTxId2))
        ).getHeight();

        assertThat(lottery2.dataStr("randomRequestTx")).isEqualTo(randTxId2);
        assertThat(lottery2.dataInt("startHeight")).isEqualTo(regTx2Height);
        assertThat(lottery2.data()).hasSize(1 + 2);
    }

    @Test @Order(5) //TODO can't before reveal
    @DisplayName("can define first winner")
    void define1stWinner() {
        oracle.writes(d -> d.string(randTxId1, "FINISHED_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_--3"));

        admin.invokes(i -> i.dApp(lottery1).function("defineTheWinner", arg("ticketsFrom1To3")));

        assertThat(lottery1.dataInt("winnerTicket")).isEqualTo(3);
        assertThat(lottery1.dataStr("winnerAddress")).isEqualTo(player1.address());
        assertThat(lottery1.data()).hasSize(3 + 2);
    }

    @Test @Order(6)
    @DisplayName("can define second winner")
    void define2ndWinner() {
        //TODO wip
        oracle.writes(d -> d.string(randTxId2, "FINISHED_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_0_1_--3"));

        admin.invokes(i -> i.dApp(hub).function("addWinner", arg(lottery1.address())));

        assertThat(hub.dataStr("winningTicket" + 3)).isEqualTo(player1.address());
        assertThat(hub.data()).hasSize(12 + 1);

        player2.invokes(i -> i.dApp(lottery2).function("withdraw"));

        System.out.println("result balance: " + player1.balance());
        assertThat(player1.balance()).isGreaterThan(player1InitBalance);
    }

}
