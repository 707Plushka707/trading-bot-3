const TradeStrategy = require("./tradestrategy");

class PercentTradeStrategy extends TradeStrategy {

    /*
    {
        open: price,
        opentime: timestamp,
        amount: amount
    }

    */
    long = null;
    shorts = null;

    BASE_ASSET = 100;
    totalWin = 0;

    evaluate() {
        // get last kline
        const lastKline = this.klines[this.klines.length - 1];

        // first evaluation
        if(!this.long && !this.short) {
            const trend = this.isDownOrUpTrend();
            if(trend == 1) {
                // uptrend
                this.addLong(lastKline.close * 1, lastKline.closetime);
            }
            
            if(trend == -1) {
                // downtrend
                this.addShort(lastKline.close * 1, lastKline.closetime);
            }

            return;
        }

        
        // price up evaluation
        let nextLongPrice = this.getNextLongPrice();
        if(lastKline.close * 1 >= nextLongPrice) {
            while(lastKline.close >= nextLongPrice) {
                // +2%

                const currentPrice = nextLongPrice;

                if(this.long && this.short) {
                    // close all
                    this.totalWin += ((currentPrice * this.long.amount) - this.BASE_ASSET);
                    this.totalWin += ((currentPrice * this.short.amount) - this.BASE_ASSET) * -1;
    
                    console.log(`close all for long, totalwin : ${this.totalWin}, time : ${lastKline.closetime}`);
                    this.short = null;
                    this.long = null;
                }
                
                // open long
                this.addLong(currentPrice, lastKline.closetime);

                // get next long price
                nextLongPrice = this.getNextLongPrice();
            }
        }

        // price down evaluation
        let nextShortPrice = this.getNextShortPrice();
        if(lastKline.close * 1 <= nextShortPrice) {
            while(lastKline.close <= nextShortPrice) {
                // -2%

                const currentPrice = nextShortPrice;

                if(this.long && this.short) {
                    // close all
                    this.totalWin += ((currentPrice * this.long.amount) - this.BASE_ASSET);
                    this.totalWin += ((currentPrice * this.short.amount) - this.BASE_ASSET) * -1;
                    
                    console.log(`close all for short, totalwin : ${this.totalWin}, time : ${lastKline.closetime}`);
                    this.short = null;
                    this.long = null;
                }
                
                // open long
                this.addShort(currentPrice, lastKline.closetime);

                // get next short price
                nextShortPrice = this.getNextShortPrice();
            }
        }
        //console.log(`nextLongPrice:${nextLongPrice}, nextShortPrice:${nextShortPrice}, close:${lastKline.close}, time:${lastKline.closetime}`)
    }

    getNextLongPrice() {
        if(this.long) {
            return this.long.open * 1.02;
        }

        if(this.short) {
            return this.short.open * 1.02;
        }

        throw new Error("Can not find next long price");
    }

    getNextShortPrice() {
        if(this.short) {
            return this.short.open * 0.98;
        }

        if(this.long) {
            return this.long.open * 0.98;
        }

        throw new Error("Can not find next short price");
    }

    addLong(open, opentime) {
        this.long ={
            open,
            opentime,
            amount: this.BASE_ASSET / open,
        };
    }

    addShort(open, opentime) {
        this.shorts = {
            open,
            opentime,
            amount: this.BASE_ASSET / open,
        };
    }
    
}

module.exports = PercentTradeStrategy