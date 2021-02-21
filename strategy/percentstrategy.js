const TradeStrategy = require("./tradestrategy");

class PercentTradeStrategy extends TradeStrategy {

    /*
    {
        open: price,
        opentime: timestamp
    }

    */
    longs = new Array();
    shorts = new Array();
    firstPrice = 0;
    secondPrice = 0;

    BASE_ASSET = 100;
    totalWin = 0;

    evaluate() {
        // get last kline
        const lastKline = this.klines[this.klines.length - 1];

        // first evaluation
        if(this.longs.length == 0 && this.shorts.length == 0) {
            const trend = this.isDownOrUpTrend();
            if(trend == 1) {
                // uptrend
                this.addLong(lastKline.close, lastKline.closetime);
                this.firstPrice = lastKline.close;
                this.secondPrice = lastKline.close * 0.98;
            }
            
            if(trend == -1) {
                // downtrend
                this.addShort(lastKline.close, lastKline.closetime);
                this.firstPrice = lastKline.close;
                this.secondPrice = lastKline.close * 1.02;
            }

            return;
        }

        // price up evaluation
        if(this.longs.length > 0) {
            let nextLongPrice = this.longs[this.longs.length - 1].open * 1.02;
            // console.log(`nextLongPrice:${nextLongPrice}, close:${lastKline.close}, time:${lastKline.closetime}`)
            if(lastKline.close > nextLongPrice) {
                while(lastKline.close > nextLongPrice) {
                    // +2%
                    if(this.longs.length > this.shorts.length) {
                        // close all
                        this.longs.forEach((l) => {
                            this.totalWin += this.BASE_ASSET - ((nextLongPrice / l.open) * this.BASE_ASSET);
                        })
        
                        this.shorts.forEach((s) => {
                            this.totalWin += this.BASE_ASSET - ((nextLongPrice / s.open) * (-1) * this.BASE_ASSET);
                        })
    
                        console.log(`close all for long, totalwin : ${this.totalWin}, time : ${lastKline.closetime}`);
                    }
                    
                    // open long
                    this.addLong(nextLongPrice, lastKline.closetime);
        
                    nextLongPrice = this.longs[this.longs.length - 1].open * 1.02;
                }
                return;
            }
        }

        // price down evaluation
        if(this.shorts.length > 0) {
            let nextShortPrice = this.shorts[this.shorts.length - 1].open * 0.98;
            if(lastKline.close < nextShortPrice) {
                while(lastKline.close < nextShortPrice) {
                    // -2%
                    if(this.shorts.length > this.longs.length) {
                        // close all
                        this.shorts.forEach((l) => {
                            this.totalWin += this.BASE_ASSET - ((nextShortPrice / l.open) * this.BASE_ASSET);
                        })
        
                        this.longs.forEach((s) => {
                            this.totalWin += this.BASE_ASSET - ((nextShortPrice / s.open) * (-1) * this.BASE_ASSET);
                        })
                        
                        console.log(`close all for short, totalwin : ${this.totalWin}, time : ${lastKline.closetime}`);
                    }
                    
                    // open long
                    this.addShort(nextShortPrice, lastKline.closetime);
        
                    nextShortPrice = this.shorts[this.shorts.length - 1].open * 0.98;
                }
                return;
            }
        }
    }

    addLong(open, opentime) {
        console.log("add long", {open, opentime});
        this.longs.push({
            open,
            opentime,
        });
    }

    addShort(open, opentime) {
        console.log("add short", {open, opentime});
        this.shorts.push({
            open,
            opentime,
        });
    }
    
}

module.exports = PercentTradeStrategy