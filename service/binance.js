const Binance = require('node-binance-api');
const EventEmmiter = require('events');

const binance = new Binance().options({
    APIKEY: process.env.API_KEY,
    APISECRET: process.env.API_SECRET,
});

/*
historical format :
[
  [
    1499040000000,      // Open time
    "0.01634790",       // Open
    "0.80000000",       // High
    "0.01575800",       // Low
    "0.01577100",       // Close
    "148976.11427815",  // Volume
    1499644799999,      // Close time
    "2434.19055334",    // Quote asset volume
    308,                // Number of trades
    "1756.87402397",    // Taker buy base asset volume
    "28.46694368",      // Taker buy quote asset volume
    "17928899.62484339" // Ignore.
  ]
]

websocket format :
{
  "e": "kline",     // Event type
  "E": 123456789,   // Event time
  "s": "BTCUSDT",    // Symbol
  "k": {
    "t": 123400000, // Kline start time
    "T": 123460000, // Kline close time
    "s": "BTCUSDT",  // Symbol
    "i": "1m",      // Interval
    "f": 100,       // First trade ID
    "L": 200,       // Last trade ID
    "o": "0.0010",  // Open price
    "c": "0.0020",  // Close price
    "h": "0.0025",  // High price
    "l": "0.0015",  // Low price
    "v": "1000",    // Base asset volume
    "n": 100,       // Number of trades
    "x": false,     // Is this kline closed?
    "q": "1.0000",  // Quote asset volume
    "V": "500",     // Taker buy base asset volume
    "Q": "0.500",   // Taker buy quote asset volume
    "B": "123456"   // Ignore
  }
}
*/

class BinanceService extends EventEmmiter {

    listen(params) {

        let { symbol, interval } = params;

        if(!symbol) {
            throw new Error("You must specify symbol to use");
        }

        if(!interval) {
            throw new Error("You must specify interval to use");
        }

        let websocketname = this.symbol.toLowerCase() + "@kline_" + this.interval;
        const websocket = binance.futuresSubscribe(websocketname, (e) => {
            if(e.k.x) {
                const klinePretty = {
                    symbol,
                    interval,
                    opentime:e.k.t,
                    open:e.k.o,
                    high:e.k.h,
                    low:e.k.l,
                    close:e.k.c,
                    volume:e.k.v,
                    closetime:e.k.T,
                    quotevolume:e.k.q,
                    numberoftrades:e.k.n,
                    takerbasevolume:e.k.V,
                    takerquotevolume:e.k.Q,
                    ignore:e.k.B,
                };

                this.emit("newKline", klinePretty);
            }
        });

        return websocket;
    }

    async getHistoricalKlines(params) {

        let { startTime, limit, symbol, interval } = params;

        if(!symbol) {
            throw new Error("You must specify symbol to use");
        }

        if(!interval) {
            throw new Error("You must specify interval to use");
        }

        if(!limit) {
            limit = 400;
        }

        const baseDateTime = new Date();

        const klines = 
          await binance.futuresCandles(
            symbol,
            interval,
            {
                limit,
                startTime
            }
        );

        const klinesPretty = [];

        for(let i = 0; i < klines.length; i++) {
            const k = klines[i];
            klinesPretty.push({
                symbol,
                interval,
                opentime:k[0],
                open:k[1],
                high:k[2],
                low:k[3],
                close:k[4],
                volume:k[5],
                closetime:k[6],
                quotevolume:k[7],
                numberoftrades:k[8],
                takerbasevolume:k[9],
                takerquotevolume:k[10],
                ignore:k[11],
            });
        }

        // Remove kline if it is not closed
        if(baseDateTime.getTime() > klinesPretty[klinesPretty.length - 1].opentime &&
            baseDateTime.getTime() < klinesPretty[klinesPretty.length - 1].closetime) {
            klinesPretty.pop();
        }

        return klinesPretty;
    }
}

module.exports = BinanceService