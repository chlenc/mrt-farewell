const langs = {
    rus: {
        subtitleChunk1: "В связи с этим",
        subtitleChunk2: "1 000 000 волн",
        subtitleChunk3: "при аренде будет разыграно",
        fomoSubtitleChunk1: "Кто купил",
        fomoSubtitleChunk2: "последний выигранный билет",
        fomoSubtitleChunk3: "раунд",
        fomoText: "Если никто не купил билет в течение 15 минут после времени покупки билета, вы выигрываете раунд. В конце раунда выигрывает последний купленный билет. Раунд длится один день, последний раунд - 13 января",
        lotterySubtitle: "Лотереи пройдут 13 декабря и 13 января. В течение этих двух дней будут сданы в аренду следующие суммы: ",
        littleRhombusTextChunk1: "Выбрать",
        littleRhombusTextChunk2: "как победить",
        noKeeperChunk1: "Для участия в мероприятиях используйте",
        noKeeperChunk2: "настольный браузер",
        noKeeperChunk3: "с установленным",
        noKeeperChunk4: "Хранитель волн",
        noKeeperChunk5: "плагин",
    },
    eng: {
        subtitleChunk1: 'In this regard,',
        subtitleChunk2: '1,000,000 WAVES',
        subtitleChunk3: 'in leaseing will be ruffled off',
        fomoSubtitleChunk1: 'Who bought the',
        fomoSubtitleChunk2: 'last ticket won',
        fomoSubtitleChunk3: 'the round',
        fomoText: 'If no one has bought a ticket within 15 minutes after your ticket purchase time, you win the round. At the end of the round, the last ticket bought wins. The round lasts one day, the last round is January 13th',
        lotterySubtitle: 'Lotteries will be held on 13 December and 13 January. During these two days, the following amounts will be drawn on lease:',
        littleRhombusTextChunk1: 'Choose',
        littleRhombusTextChunk2: 'how to win',
        noKeeperChunk1: 'To participatese in activities, use',
        noKeeperChunk2: 'desktop browser',
        noKeeperChunk3: 'with installed',
        noKeeperChunk4: 'Waves Keeper',
        noKeeperChunk5: 'plugin',
    }
};

const defaultLang = 'eng';


$(document).ready(function () {

    setLang(defaultLang)

    function setLang(lang) {
        var r = $('.localization').each(function () {
            var el = $(this);
            var key = (el.attr('caption'));
            $('.'+lang).hide();
            $('.'+Object.keys(langs).find(l => l !== lang)).show();

            el.text(langs[lang][key]);
        });
    }

    $('.rus').on('click', function () {
        setLang('rus')
    });


    $('.eng').on('click', function () {
        setLang('eng')
    });


});
