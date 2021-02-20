const TradeStrategy = require("./tradestrategy");
const { MACD, EMA, RSI } = require("talib-binding");

class MacdEma200Strategy extends TradeStrategy {

    evaluate() {
        // get last kline
        const lastKline = this.klines[this.klines.length - 1];

        // get close values
        const close = new Array();
        for(let i = 0; i < this.klines.length; i++) {
            close.push(this.klines[i].close);
        }

        // get indicators
        const macd = MACD(close);
        const ema200 = EMA(close, 200)

        const lastMACD = {
            macd: macd[0][macd[0].length - 1],
            signal: macd[1][macd[1].length - 1],
            histogram: macd[2][macd[2].length - 1],
        };
        const beforeLastMACD = {
            macd: macd[0][macd[0].length - 2],
            signal: macd[1][macd[1].length - 2],
            histogram: macd[2][macd[2].length - 2],
        };

        const lastEma2000 = ema200[ema200.length -1];
        
        if(lastMACD.macd > lastMACD.signal) {

            // if before last macd < signal
            if(beforeLastMACD.macd < beforeLastMACD.signal) {
                // close short
                // console.log("close short", logInfo);
                this.emit("closeShort", lastKline);

                if(lastKline.close > lastEma2000 && lastKline.open > lastEma2000) {
                    // open long
                    // console.log("open long", logInfo);
                    this.emit("openLong", lastKline);
                }
            }
        }

        // if last macd < signal
        if(lastMACD.macd < lastMACD.signal) {

            // if before last macd > signal
            if(beforeLastMACD.macd > beforeLastMACD.signal) {
                // close long
                // console.log("close long", logInfo);
                this.emit("closeLong", lastKline);

                if(lastKline.close < lastEma2000 && lastKline.open < lastEma2000) {
                    // open short
                    // console.log("open short", logInfo);
                    this.emit("openShort", lastKline);
                }
            }
        }
    }
}

module.exports = MacdEma200Strategy;