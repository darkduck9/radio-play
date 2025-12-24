function getSavedOrder() {
    const savedOrder = localStorage.getItem('radioOrder');
    return savedOrder ? JSON.parse(savedOrder) : null;
}

function saveOrder(order) {
    localStorage.setItem('radioOrder', JSON.stringify(order));
}

const defaultRadioStations = [
    {
        name: "Capital FM",
        icon: "./icons/Capital.png",
        params: {
            url: "https://ice-sov.musicradio.com/CapitalUKHD?hdauth=:2000000000:a290d4b39a16153061d4c743008b9fe8d424a7e5ec6469d40acf51fdcd336e80",
            title: "Capital FM",
            cover: "./icons/Capital.png",
            channel: "Capital",
            id: "Capital",
            mark: 0
        }
    },
    {
        name: "2DayFM",
        icon: "./icons/2Day.png",
        params: {
            url: "https://wz2liw.scahw.com.au/live/2day_128.stream/playlist.m3u8",
            title: "2DayFM",
            cover: "./icons/2Day.png",
            channel: "2DayFM",
            id: "2DayFM",
            mark: 0
        }
    },
        {
        name: "Hit Nation",
        icon: "./icons/hitn.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc4422/hls.m3u8",
            title: "Hit Nation",
            cover: "./icons/hitn.webp",
            channel: "hitn",
            id: "4422",
            mark: 1
        }
    },
    {
        name: "Evolution",
        icon: "./icons/evo.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc5953/hls.m3u8",
            title: "Evolution",
            cover: "./icons/evo.webp",
            channel: "ev",
            id: "5953",
            mark: 1
        }
    },
    {
        name: "American Top 40",
        icon: "./icons/at40.svg",
        params: {
            url: "https://stream.revma.ihrhls.com/zc4802/hls.m3u8",
            title: "American Top 40",
            cover: "./icons/at40.svg",
            channel: "at40",
            id: "4802",
            mark: 2
        }
    },
        {
        name: "107.5 WGCI Chicago",
        icon: "./icons/wgc.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc841/hls.m3u8",
            title: "107.5 WGCI Chicago",
            cover: "./icons/wgc.webp",
            channel: "wgc",
            id: "841",
            mark: 1
        }
    },

    {
        name: "iHeartCountry",
        icon: "./icons/ic.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc4418/hls.m3u8",
            title: "iHeartCountry",
            cover: "./icons/ic.webp",
            channel: "ic",
            id: "4418",
            mark: 1
        }
    },
    {
        name: "iHeartRadio POP",
        icon: "./icons/ip.webp",
        params: {
            url: "https://playerservices.streamtheworld.com/api/livestream-redirect/ACIR31_S01AAC.m3u8",
            title: "iHeartRadio POP",
            cover: "./icons/ip.webp",
            channel: "ip",
            id: "8167",
            mark: 2
        }
    },

    {
        name: "iHeartRadio Music Festival",
        icon: "./icons/imf.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc5158/hls.m3u8",
            title: "iHeartRadio Music Festival",
            cover: "./icons/imf.webp",
            channel: "imf",
            id: "5158",
            mark: 1
        }
    },

        {
        name: "Z100",
        icon: "./icons/z100.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc1469/hls.m3u8",
            title: "Z100",
            cover: "./icons/z100.webp",
            channel: "z100",
            id: "1469",
            mark: 1
        }
    },
    {
        name: "102.7 KIIS-FM",
        icon: "./icons/kiis.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc185/hls.m3u8",
            title: "102.7 KIIS-FM",
            cover: "./icons/kiis.webp",
            channel: "kiis",
            id: "185",
            mark: 1
        }
    },
       {
        name: "Alice 95.5",
        icon: "./icons/alic.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc1269/hls.m3u8",
            title: "Alice 95.5",
            cover: "./icons/alic.webp",
            channel: "alic",
            id: "1269",
            mark: 1
        }
    },
        {
        name: "Rock Nation",
        icon: "./icons/rn.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc4443/hls.m3u8",
            title: "Rock Nation",
            cover: "./icons/rn.webp",
            channel: "rn",
            id: "4443",
            mark: 1
        }
    },
    {
        name: "Mix Nation",
        icon: "./icons/mixn.webp",
        params: {
            url: "https://stream.revma.ihrhls.com/zc4776/hls.m3u8",
            title: "Mix Nation",
            cover: "./icons/mixn.webp",
            channel: "mixn",
            id: "4776",
            mark: 2
        }
    },
 

    {
        name: "BBC Radio 1",
        icon: "./icons/bbc1.svg",
        params: {
            url: "https://as-hls-ww-live.akamaized.net/pool_01505109/live/ww/bbc_radio_one/bbc_radio_one.isml/bbc_radio_one-audio%3d320000.norewind.m3u8",
            title: "BBC Radio 1",
            cover: "./icons/bbc1.svg",
            channel: "bbc",
            id: "bbc_radio_one",
            mark: 3
        }
    },
    {
        name: "BBC Radio 1Xtra",
        icon: "./icons/bbc1x.svg",
        params: {
            url: "https://as-hls-ww-live.akamaized.net/pool_92079267/live/ww/bbc_1xtra/bbc_1xtra.isml/bbc_1xtra-audio%3d320000.norewind.m3u8",
            title: "BBC Radio 1Xtra",
            cover: "./icons/bbc1x.svg",
            channel: "bbc",
            id: "bbc_1xtra",
            mark: 3
        }
    },
    {
        name: "BBC Radio 1 Dance",
        icon: "./icons/bbc1d.svg",
        params: {
            url: "https://as-hls-ww-live.akamaized.net/pool_62063831/live/ww/bbc_radio_one_dance/bbc_radio_one_dance.isml/bbc_radio_one_dance-audio%3d320000.norewind.m3u8",
            title: "BBC Radio 1 Dance",
            cover: "./icons/bbc1d.svg",
            channel: "bbc",
            id: "bbc_radio_one_dance",
            mark: 3
        }
    },
    {
        name: "BBC Radio 6 Music",
        icon: "./icons/bbc6.svg",
        params: {
            url: "https://as-hls-ww.live.cf.md.bbci.co.uk/pool_81827798/live/ww/bbc_6music/bbc_6music.isml/bbc_6music-audio%3d320000.norewind.m3u8",
            title: "BBC Radio 6 Music",
            cover: "./icons/bbc6.svg",
            channel: "bbc",
            id: "bbc_6music",
            mark: 3
        }
    },
   
];

function getRadio() {
    const savedOrder = getSavedOrder();
    if (savedOrder) {
        // 根据保存的顺序重新排列电台
        return savedOrder.map(id => 
            defaultRadioStations.find(station => station.params.id === id)
        ).filter(Boolean);
    }
    return defaultRadioStations;
}

// 导出函数和数据
export { getRadio, defaultRadioStations, saveOrder }; 