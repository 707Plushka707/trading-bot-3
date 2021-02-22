const TradeStrategy = require("./tradestrategy");
const { datediff, formatDate } = require("../utils/date");

const SPREAD = 0.03;
const MAX_DIFF = 0;

class PercentTradeStrategy extends TradeStrategy {

    /*
    {
        open: price,
        opentime: timestamp,
        amount: amount
    }
    */

    longs = new Array();
    shorts = new Array();

    maxMinutesToClose = 0;
    avgMinutesToClose = -1;
    maxNbSubTrades = 0;
    avgNbSubTrades = -1;
    tradeCount = 0;
    // allMinutesToClose = new Array();

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
                if(this.longs.length >= this.shorts.length + MAX_DIFF) {
                    // close all
                    this.longs.forEach((l) => {
                        this.totalWin += ((nextLongPrice * l.amount) - this.BASE_ASSET);
                    });

                    this.shorts.forEach((s) => {
                        this.totalWin += ((nextLongPrice * s.amount) - this.BASE_ASSET) * -1;
                    });
    
                    this.logTradeInfo("long", lastKline.closetime);

                    this.shorts = new Array();
                    this.longs = new Array();
                }
                
                // open long
                this.addLong(nextLongPrice, lastKline.closetime);

                // get next long price
                nextLongPrice = this.getNextLongPrice();
            }
        }

        // price down evaluation
        let nextShortPrice = this.getNextShortPrice();
        if(lastKline.close * 1 <= nextShortPrice) {
            while(lastKline.close <= nextShortPrice) {
                // -2%
                if(this.shorts.length >= this.longs.length + MAX_DIFF) {
                    // close all
                    this.shorts.forEach((s) => {
                        this.totalWin += ((nextShortPrice * s.amount) - this.BASE_ASSET) * -1;
                    })

                    this.longs.forEach((l) => {
                        this.totalWin += ((nextShortPrice * l.amount) - this.BASE_ASSET);
                    })
                    
                    this.logTradeInfo("short", lastKline.closetime);

                    this.shorts = new Array();
                    this.longs = new Array();
                }
                
                // open long
                this.addShort(nextShortPrice, lastKline.closetime);

                // get next short price
                nextShortPrice = this.getNextShortPrice();
            }
        }
    }

    getNextLongPrice() {

        let nextLongPrice = -1;
        let firstPrice = -1;
        let lastLongPrice = -1;
        let i = 1;

        if(this.longs.length == 0) {
            firstPrice = this.shorts[0].open;
            lastLongPrice = firstPrice;
        } else {
            firstPrice = this.longs[0].open;
            lastLongPrice = this.longs[this.longs.length - 1].open;
        }

        nextLongPrice = firstPrice;
        while(nextLongPrice <= lastLongPrice) {
            let coef = SPREAD * i;
            nextLongPrice = firstPrice * (1 + coef);
            i++;
        }
        
        return nextLongPrice;

        // let nextLongPrice = this.firstPrice;
        // let lastTradePrice;
        // let i = 1;

        // if(this.longs.length == 0) {
        //     lastTradePrice = this.shorts[0].open * 1;
        // } else {
        //     lastTradePrice = this.longs[this.longs.length - 1].open * 1;
        // }

        // while(nextLongPrice <= lastTradePrice) {
        //     let coef = 0.02 * i;
        //     nextLongPrice = this.firstPrice * (1 + coef);
        //     //nextLongPrice = this.firstPrice * Math.pow(1.02, i);
        //     i++;
        // }
        // return nextLongPrice;
    }

    getNextShortPrice() {

        let nextShortPrice = -1;
        let firstPrice = -1;
        let lastShortPrice = -1;
        let i = 1;

        if(this.shorts.length == 0) {
            firstPrice = this.longs[0].open;
            lastShortPrice = firstPrice;
        } else {
            firstPrice = this.shorts[0].open;
            lastShortPrice = this.shorts[this.shorts.length - 1].open;
        }

        nextShortPrice = firstPrice;
        while(nextShortPrice >= lastShortPrice) {
            let coef = SPREAD * i;
            nextShortPrice = firstPrice * (1 - coef);
            i++;
        }

        return nextShortPrice;
    }

    addLong(open, opentime) {
        this.longs.push({
            open,
            opentime,
            amount: this.BASE_ASSET / open,
        });
    }

    addShort(open, opentime) {
        this.shorts.push({
            open,
            opentime,
            amount: this.BASE_ASSET / open,
        });
    }

    getLowerTradeTime() {

        let lowerTime = this.shorts.length > 0 ? this.shorts[0].opentime : this.longs[0].opentime;
        this.shorts.forEach((s) => {
            if(s.opentime < lowerTime) {
                lowerTime = s.opentime;
            }
        })

        this.longs.forEach((l) => {
            if(l.opentime < lowerTime) {
                lowerTime = l.opentime;
            }
        })

        return lowerTime;
    }

    getMinuteToClose(closetime) {
        const lowerTradeTime = this.getLowerTradeTime();
        const minutesToClose = datediff(closetime, lowerTradeTime);

        if(this.maxMinutesToClose < minutesToClose) {
            this.maxMinutesToClose = minutesToClose;
        }

        if(this.avgMinutesToClose == -1) {
            this.avgMinutesToClose = minutesToClose;
        } else {
            const totalMinutes = (this.avgMinutesToClose * this.tradeCount) + minutesToClose;
            this.avgMinutesToClose = (totalMinutes / (this.tradeCount+1));
        }

        return minutesToClose;
    }

    setMaxAndAvgNbSubTrades(nbsubtrades) {

        if(this.maxNbSubTrades < nbsubtrades) {
            this.maxNbSubTrades = nbsubtrades;
        }

        if(this.avgNbSubTrades == -1) {
            this.avgNbSubTrades = nbsubtrades;
        } else {
            const totalMinutes = (this.avgNbSubTrades * this.tradeCount) + nbsubtrades;
            this.avgNbSubTrades = (totalMinutes / (this.tradeCount+1));
        }
    }

    logTradeInfo(type, closetime) {
        let minutesToClose = this.getMinuteToClose(closetime);
        let nbsubtrades = this.longs.length + this.shorts.length;
        this.setMaxAndAvgNbSubTrades(nbsubtrades);
        this.tradeCount++;


        if(this.longs.length + this.shorts.length == 5) 
        {
            console.log("!!!")
        }

        console.log(
            `close ${type}, ` + 
            `time to close : ${Math.round(minutesToClose/60)}, ` + 
            `max : ${Math.round(this.maxMinutesToClose/60)}, ` + 
            `avg : ${Math.round(this.avgMinutesToClose/60)}, ` + 
            `nb : ${nbsubtrades}, ` + 
            // `${this.shorts.length == 1 && this.longs.length == 1 ? " XXX " : "" }` + 
            `max : ${this.maxNbSubTrades}, ` + 
            `avg : ${this.avgNbSubTrades}, ` + 
            `totalwin : ${this.totalWin}, ` +
            `time : ${formatDate(closetime)}`);
    }
    
}

module.exports = PercentTradeStrategy