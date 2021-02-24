require('dotenv').config()
const { simulation } = require('./simulation');
const BinanceService = require('./service/binance')
const BinanceService2 = require('./service/binance2')

//simulation();

const start = async() =>  {

    //const binanceService = new BinanceService2();
    const binanceService = new BinanceService();
    binanceService.checkOrders();
}

start();