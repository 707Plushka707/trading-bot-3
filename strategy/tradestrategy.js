const EventEmmiter = require('events');
const Wallet = require('../wallet/wallet');

const MAX_HISTORY = 400;

class TradeStrategy extends EventEmmiter {

    #klines = new Array();
    wallet = null;

    constructor() {
        super();
        if (this.constructor === TradeStrategy) {
            throw new TypeError('Abstract class "TradeStrategy" cannot be instantiated directly');
        }
        this.klines = new Array();
        this.wallet = new Wallet();

        // -- Events Start
      
        this.on("openLong", this.wallet.openLong);
    
        this.on("closeLong" , this.wallet.closeLong);
    
        this.on("openShort" , this.wallet.openShort);
    
        this.on("closeShort" , this.wallet.closeShort);
  
        // -- Events End
    }

    init(klines) {
        this.klines = klines;
    }

    addKline(kline) {
        this.klines.push(kline);

        if(this.klines.length > MAX_HISTORY) {
            this.klines.shift();
            const decision = this.evaluate();
        }
    }
}

module.exports = TradeStrategy;