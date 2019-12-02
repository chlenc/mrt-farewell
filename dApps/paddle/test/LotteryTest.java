import im.mak.paddle.Account;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static im.mak.paddle.Async.async;
import static im.mak.paddle.actions.invoke.Arg.arg;
import static im.mak.paddle.actions.mass.Recipient.to;
import static im.mak.paddle.util.Script.fromFile;
import static org.assertj.core.api.Assertions.assertThat;

class LotteryTest {

    private Account owner, admin, oracle, hub, lottery1, player1, player2;
    private String MRT;
    private String randTxId = "2vmvnr79De1Y9GtMM3NQfhzrbwt93UuUMCER6GbBTFsj";

    @BeforeEach
    void before() {
        async(
                ()-> {
                    owner = new Account("owner", 1000000_00000000L);
                    MRT = owner.issues(i -> i.quantity(10000000).decimals(2)).getId().toString();
                },
                ()-> admin = new Account("admin", 1_00000000),
                ()-> oracle = new Account("oracle", 1_00000000),
                ()-> hub = new Account("hub", 1_00000000),
                ()-> lottery1 = new Account("lottery1", 1_00000000),
                ()-> player1 = new Account("player1", 1_00000000),
                ()-> player2 = new Account("player2", 1_00000000)
        );
        async(
                () -> owner.massTransfers(t -> t.asset(MRT).recipients(to(player1, 1000000))),
                () -> hub.writes(d -> d
                        .string("mrt_id", MRT)
                        .string("address_owner", owner.address())
                        .string("address_admin", admin.address())
                        .string("address_oracle", oracle.address())
                        .string("status", "ticketingPeriod")
                        .integer("withdraw_period", 3)
                        .bool("lottery_" + lottery1.address(), true)
                ),
                () -> lottery1.writes(d -> d.string("address_hub", hub.address())),
                () -> oracle.writes(d -> d.string(
                        randTxId,
                        "FINISHED_3BQLGEqFWbtpDHVcqpRm77CB8kLiv9toxx6CJNmXX4qn_1_10_1_0_5_2gJwbymK377GH53yNLPnih6KhYBAj2ZVNs2khbkR4A1B_11_0_1_0_1_--3"))
        );
        async(
                () -> hub.setsScript(s -> s.script(fromFile("../lotteryHub.ride"))),
                () -> lottery1.setsScript(s -> s.script(fromFile("../lottery.ride")))
        );
    }

    @Test
    void play() {
        long player1InitBalance = player1.balance();
        System.out.println("init balance: " + player1InitBalance);

        player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(39999, MRT));
        player2.invokes(i -> i.dApp(hub).function("buyTicket").payment(10000, MRT));
        player1.invokes(i -> i.dApp(hub).function("buyTicket").payment(10001, MRT));

        assertThat(hub.dataInt("ticketAmountTotal")).isEqualTo(5);
        assertThat(hub.dataStr("ticketsFrom1To3")).isEqualTo(player1.address());
        assertThat(hub.dataStr("ticketsFrom4To4")).isEqualTo(player2.address());
        assertThat(hub.dataStr("ticketsFrom5To5")).isEqualTo(player1.address());
        assertThat(hub.data()).hasSize(6 + 4);

        int regTxHeight = admin
                .invokes(i -> i.dApp(lottery1).function("registerRandomRequestTx", arg(randTxId)))
                .getHeight();

        assertThat(lottery1.dataStr("randomRequestTx")).isEqualTo(randTxId);
        assertThat(lottery1.dataInt("startHeight")).isEqualTo(regTxHeight);
        assertThat(lottery1.data()).hasSize(1 + 2);

        admin.invokes(i -> i.dApp(lottery1).function("defineTheWinner", arg("ticketsFrom1To3")));

        assertThat(lottery1.dataInt("winnerTicket")).isEqualTo(3);
        assertThat(lottery1.dataStr("winnerAddress")).isEqualTo(player1.address());
        assertThat(lottery1.data()).hasSize(3 + 2);

        admin.invokes(i -> i.dApp(hub).function("addWinner", arg(lottery1.address())));

        assertThat(hub.dataStr("winningTicket" + 3)).isEqualTo(player1.address());
        assertThat(hub.data()).hasSize(10 + 1);

        player1.invokes(i -> i.dApp(lottery1).function("withdraw"));

        System.out.println("result balance: " + player1.balance());
        assertThat(player1.balance()).isGreaterThan(player1InitBalance);
    }

}
