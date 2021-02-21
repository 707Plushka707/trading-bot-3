class Twopercentanalyze {

    baseprice = -1;
    basetime = -1;
    countplustwopercent = 0;
    countminustwopercent = 0;

    maxlowissue = 1;
    maxhighissue = 1;

    newPrice(kline) {

        if(kline.high / kline.close > 1.02) {
            if((kline.high / kline.close) > this.maxhighissue) {
                this.maxhighissue = (kline.high / kline.close);
            }
            console.log("high issue : " + 
            (kline.high / kline.close) + " : " + 
            this.maxhighissue + " : " + 
            this.maxlowissue + " : " + 
            kline.closetime);
        }
        if(kline.low / kline.close < 0.98) {
            if((kline.low / kline.close) < this.maxlowissue) {
                this.maxlowissue = (kline.low / kline.close);
            }
            console.log("low issue : " + 
            (kline.low / kline.close) + " : " + 
            this.maxhighissue + " : " + 
            this.maxlowissue + " : " + 
            kline.closetime);
        }

        // if(this.baseprice == -1) {
        //     this.baseprice = price;
        //     this.basetime = time;
        //     return;
        // }

        // if(price / this.baseprice >= 1.02) {
        //     // +2%
        //     this.countplustwopercent++;
        //     console.log("+++ 2%", { no: this.countplustwopercent + this.countminustwopercent, time });
        //     this.baseprice = price;
        //     this.basetime = time;
        //     return;
        // }

        // if(price / this.baseprice <= 0.98) {
        //     // -2%
        //     this.countminustwopercent++;
        //     console.log("--- 2%", { no: this.countplustwopercent + this.countminustwopercent, time });
        //     this.baseprice = price;
        //     this.basetime = time;
        //     return;
        // }

    }
    
}

module.exports = Twopercentanalyze