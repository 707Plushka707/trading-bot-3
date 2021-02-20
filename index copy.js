require('dotenv').config()
const { sleep } = require('./utils/sleep')
const { consoleLogger, fileLogger } = require('./utils/logger');
const BinanceService = require('./service/binance')
const { KlineModel } = require('./model/klines')
const MacdEma200Strategy = require('./strategy/macdema200strategy');
const { exitOnError } = require('winston');

const start = async() => {
    require('./startup/database').init();

    console.log("start");

    const testconfig = {
        symbol: 'BTCUSDT',
        interval: '4h'
    };
    
    // const firstKline = await 
    //     KlineModel.findOne(testconfig)
    //         .sort({ closetime: 1 })
    //         .limit(1)

    // console.log(firstKline.closetime);
    // return;

    const klines = 
        await KlineModel.find(testconfig)
            .sort({ closetime: 1 });

    // console.log(klines[20].toJSON().open);
    const macdEma200Strategy = new MacdEma200Strategy();
    klines.forEach(k => {
        macdEma200Strategy.addKline(k.toJSON());
    })

    console.log("end");
    // klines.forEach(k => {
    //     macdEma200Strategy.addKline(k.toJSON());
    // })


}

start();