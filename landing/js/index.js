const langs = {
    rus: {
        subtitleChunk1: "В течении двух месяцев разыграем",
        subtitleChunk2: "70,000 WAVES",
        subtitleChunk3: "",
        fomoSubtitleChunk1: "Кто купил",
        fomoSubtitleChunk2: "последний выигранный билет",
        fomoSubtitleChunk3: "раунд",
        fomoText: "Один билет = 100 MRT. Вы выигрываете раунд, если после Вас никто не купил билет в течение 15 минут. В конце раунда выигрывает последний купленный билет. Раунд длится один день, последний раунд - 13 января",
        lotterySubtitle: "Два розыгрыша пройдут 13 декабря и 13 января. Один билет = 100 MRT. В каждый из этих дней будут разыграны следующие суммы: ",
        littleRhombusTextChunk1: "Выбрерите игру",
        littleRhombusTextChunk2: "",
        noKeeperChunk1: "Для участия в розыгрышах используйте",
        noKeeperChunk2: "браузер с плагином",
        noKeeperChunk3: "WavesKeeper",
        //noKeeperChunk4: "Хранитель волн",
        //noKeeperChunk5: "плагин",
    },
    eng: {
        subtitleChunk1: '',
        subtitleChunk2: '70 000 WAVES',
        subtitleChunk3: 'are up for grabs in two competitions',
        fomoSubtitleChunk1: 'Who bought the',
        fomoSubtitleChunk2: 'last ticket won',
        fomoSubtitleChunk3: 'the round',
        fomoText: 'Each ticket costs 100 MRT. Each round lasts one day, and the winner is the last to buy a ticket. You can also win the round if no one has bought a ticket 15 minutes after your purchase. The final round will be held on January 13.',
        lotterySubtitle: 'Two lotteries will be held on 13 December and 13 January. Each ticket costs 100 MRT, with the following prizes:',
        littleRhombusTextChunk1: 'Choose how to participate',
        littleRhombusTextChunk2: '',
        noKeeperChunk1: 'To participatese in activities, use',
        noKeeperChunk2: 'desktop browser',
        noKeeperChunk3: 'with installed',
        noKeeperChunk4: 'Waves Keeper',
        noKeeperChunk5: 'plugin',
    }
};

const defaultLang = 'eng';

function getCurrentBrowser() {
    // Opera 8.0+
    const isOpera = (!!window.opr && !!window.opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    if (isOpera) {
        return 'opera';
    }

    // Firefox 1.0+
    const isFirefox = typeof window.InstallTrigger !== 'undefined';
    if (isFirefox) {
        return 'firefox';
    }

    // Safari 3.0+ "[object HTMLElementConstructor]"
    const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
    })(!window['safari'] || (typeof window.safari !== 'undefined' && window.safari.pushNotification));
    if (isSafari) {
        return 'safari';
    }

    // Internet Explorer 6-11
    const isIE = /*@cc_on!@*/false || !!document.documentMode;
    if (isIE) {
        return 'ie';
    }

    // Edge 20+
    const isEdge = !isIE && !!window.StyleMedia;
    if (isEdge) {
        return 'edge';
    }

    // Chrome 1 - 71
    const isChrome = !!window.chrome;
    if (isChrome) {
        return 'chrome';
    }

    return '';
};


$(document).ready(function () {
    $(".invalidBrowser").hide();

    function isBrowserSupportsWavesKeeper() {
        const browser = getCurrentBrowser();
        let i = 0;

        if (!['chrome', 'firefox', 'opera', 'edge'].includes(browser)) {
            showInvalidBrowserMsg();
            return
        }

        const interval = setInterval(() => {
            const keeper = window['WavesKeeper']
            i++;
            if (keeper !== undefined) clearInterval(interval);
            if (i === 5 && keeper === undefined) {
                showInvalidBrowserMsg();
                clearInterval(interval)
            }
        }, 1000);
    }

    function showInvalidBrowserMsg() {
        $(".invalidBrowser").fadeIn('slow');
    }

    setLang(defaultLang)
    isBrowserSupportsWavesKeeper();

    function setLang(lang) {
        var r = $('.localization').each(function () {
            var el = $(this);
            var key = (el.attr('caption'));
            $('.' + lang).hide('slow');
            $('.' + Object.keys(langs).find(l => l !== lang)).show('slow');

            el.text(langs[lang][key]);
        });
    }

    $('.closeIcon').on('click', function () {
        $(".invalidBrowser").fadeOut('slow');
    });


    $('.rus').on('click', function () {
        setLang('rus')
    });


    $('.eng').on('click', function () {
        setLang('eng')
    });


});
