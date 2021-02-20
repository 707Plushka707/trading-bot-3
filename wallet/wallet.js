
class Wallet {
    
    BASEASSET = 100;
    
    currentLong = null;
    currentShort = null;
    totalWin = 0;

    constructor() {
        this.totalWin = 0
    }

    openLong = (kline) => {
            if(!this.currentLong) {
                this.currentLong = kline;
            }
        }

    openShort = (kline) => {
        if(!this.currentShort) {
            this.currentShort = kline;
        }
      }

    closeLong = (kline) => {
        if(this.currentLong) {
            const winPercent = ((kline.close - this.currentLong.close)/this.currentLong.close);
            this.totalWin += (this.BASEASSET + this.totalWin) * winPercent;
            this.currentLong = null;
            console.log("closeLong", { totalWin: this.totalWin, closetime: kline.closetime } );
        }
      }

    closeShort = (kline) => {
        if(this.currentShort) {
            const winPercent = (((kline.close - this.currentShort.close) * -1)/this.currentShort.close);
            this.totalWin += this.BASEASSET * winPercent;
            this.currentShort = null;
            console.log("closeShort", { totalWin: this.totalWin, closetime: kline.closetime } );
        }
      }
}

module.exports = Wallet;