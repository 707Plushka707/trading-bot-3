require('dotenv').config()
const { sleep } = require('./utils/sleep')
const { consoleLogger, fileLogger } = require('./utils/logger');
const BinanceService = require('./service/binance')
const { KlineModel } = require('./model/klines')

const importHistoricalData = async() => {

    const { historicalParams } = require('./utils/historicalParams');
    for(let i = 0; i < historicalParams.length; i++) {

        const { symbol, interval, startTime } = historicalParams[i];
        let klines;
        let isClosed;
        let lastOpenTime;
        lastOpenTime = startTime;
    
        do {
            let lastKline;

            await sleep(350);
            const result = await binanceService.getHistoricalKlines({
                symbol,
                interval,
                limit: 1500,
                startTime: lastOpenTime,
            });
            klines = result.klines;
            isClosed = result.isClosed;
    
            const klinesModel = new Array();
            klines.forEach((k) => {
                klinesModel.push(new KlineModel({...k}));
            })
            await KlineModel.collection.insertMany(klinesModel);
            lastKline = klines[klines.length - 1];
    
            lastOpenTime = lastKline.opentime;
            consoleLogger.info(`${symbol} : ${interval} : ${new Date(lastOpenTime)}`);
    
        } while(isClosed)
    }
    consoleLogger.info(`IMPORT END`);
}

module.exports.importHistoricalData = importHistoricalData;