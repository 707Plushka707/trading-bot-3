require('dotenv').config()
const { sleep } = require('./utils/sleep')
const { consoleLogger, fileLogger } = require('./utils/logger');
const BinanceService = require('./service/binance')
const { KlineModel } = require('./model/klines')
const MacdEma200Strategy = require('./strategy/macdema200strategy');
const PercentTradeStrategy = require('./strategy/percentstrategy');
const Twopercentanalyze = require('./analyse/twopercentanalyze');
const { exitOnError } = require('winston');

const start = async() => {
    require('./startup/database').init();

    console.log("start");

    const testconfig = {
        symbol: 'BNBUSDT',
        interval: '1m',
        closetime: { $gt: new Date(2019,9,25) }
    };
    
    const firstKline = await 
        KlineModel.findOne(testconfig)
            .sort({ closetime: 1 })
            .limit(1)


    let lowerClosetime = new Date(firstKline.closetime);
    let higherCloseTime = new Date(firstKline.closetime);
    higherCloseTime.setDate(higherCloseTime.getDate() + 1);

    const twopercentanalyze = new Twopercentanalyze();
    const percentTradeStrategy = new PercentTradeStrategy();

    do {
        const query = { ...testconfig, closetime: { $gt: lowerClosetime,  $lt: higherCloseTime } }
        const klines = 
            await KlineModel.find(query)
                .sort({ closetime: 1 })
    
        if(klines.length == 0) {
            break;
        }

        for(let i=0; i < klines.length; i++) {
            percentTradeStrategy.addKline(klines[i].toObject());
        }

        //console.log(klines[klines.length - 1].closetime)

        lowerClosetime = new Date(klines[klines.length - 1].closetime);
        higherCloseTime = new Date(klines[klines.length - 1].closetime);
        higherCloseTime.setDate(higherCloseTime.getDate() + 30);

    } while(true);

    // query = { closetime: { $gt: lowerClosetime,  $lt: higherCloseTime }, ...testconfig }
    // klines = 
    //     await KlineModel.find(query)
    //         .sort({ closetime: 1 })
    //         .limit(4000);

    //         console.log("new")
    // klines.forEach(k => {
    //     console.log(k.closetime);
    // })

    // // console.log(klines[20].toJSON().open);
    // const macdEma200Strategy = new MacdEma200Strategy();
    // klines.forEach(k => {
    //     macdEma200Strategy.addKline(k.toJSON());
    // })

    console.log("end");
    // klines.forEach(k => {
    //     macdEma200Strategy.addKline(k.toJSON());
    // })


}

start();