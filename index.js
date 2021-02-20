require('dotenv').config()
const { sleep } = require('./utils/sleep')
const { consoleLogger, fileLogger } = require('./utils/logger');
const BinanceService = require('./service/binance')

const start = async() => {
    require('./startup/database').init();

    const binanceService = new BinanceService();
    const klines = await binanceService.getHistoricalKlines({
        symbol: "BTCUSDT",
        interval: "15m",
        limit: 5,
        // startTime:(new Date("2019-01-01 00:00:00")).getTime(),
    });

    //consoleLogger.info(JSON.stringify(klines));
    console.log(klines)

}

start();