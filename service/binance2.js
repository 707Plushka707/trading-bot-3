const EventEmmiter = require('events');
const ccxt = require ('ccxt');

// const binance = new Binance().options({
//     APIKEY: process.env.API_KEY,
//     APISECRET: process.env.API_SECRET,
//     hedgeMode: true
// });

class BinanceService2 extends EventEmmiter {


    async checkOrders(){
        
        const exchangeId = 'binance'
        const exchangeClass = ccxt[exchangeId]
        const exchange = new exchangeClass ({
            'apiKey': process.env.API_KEY,
            'secret': process.env.API_SECRET,
            'timeout': 30000,
            'enableRateLimit': true,
            'options': {
                'defaultType': 'future',
                'defaultMarket': 'futures'
            },
            // 'urls': {

            //      'api': {
            //                 'public': 'https://fapi.binance.com/fapi/v1',
            //                 'private': 'https://fapi.binance.com/fapi/v1',
            //        }
            //     }
            }
        );

        //const trades = await exchange.fetchMyTrades ("symbol", "since", "limit", "params")
        // console.log (exchange.has['fetchMyTrades'])

        // let markets = await exchange.load_markets ()
        // console.log (exchange.id, markets)

        // let markets = await exchange.fetchPositions ()

        let markets = await exchange.fetchClosedOrders("TOMO/USDT");
        // const filter = markets.info.positions.filter(p => p.symbol = "UNFIUSDT");
        console.log(markets)



    }

}

module.exports = BinanceService2
