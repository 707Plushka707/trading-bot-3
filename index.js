require('dotenv').config()
const { sleep } = require('./utils/sleep')
const { consoleLogger, fileLogger } = require('./utils/logger');
const BinanceService = require('./service/binance')
const { KlineModel } = require('./model/klines')

const start = async() => {
    require('./startup/database').init();

    const binanceService = new BinanceService();


}

start();