require('dotenv').config()
const { sleep } = require('./utils/sleep')
const { consoleLogger, fileLogger } = require('./utils/logger');
const BinanceService = require('./service/binance')
const { KlineModel } = require('./model/klines')
const MacdEma200Strategy = require('./strategy/macdema200strategy');

const start = async() => {
    require('./startup/database').init();

    const binanceService = new BinanceService();
    const klines = await KlineModel.find({
        symbol: 'BTCUSDT',
        interval: '15m'
    }).sort({ opentime: 1 });

    // console.log(klines[20].toJSON().open);
    const macdEma200Strategy = new MacdEma200Strategy();
    klines.forEach(k => {
        macdEma200Strategy.addKline(k.toJSON());
    })

}

start();