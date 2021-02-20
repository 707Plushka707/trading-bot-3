const mongoose = require('mongoose');

const klineSchema = new mongoose.Schema({
    symbol: String,
    interval: String,
    opentime: Date,
    closetime: Date,
    open: mongoose.Decimal128,
    close: mongoose.Decimal128,
    high: mongoose.Decimal128,
    low: mongoose.Decimal128,
    volume: mongoose.Decimal128,
    quoteVolume: mongoose.Decimal128,
    numberoftrades: Number,
    takerbasevolume: mongoose.Decimal128,
    takerquotevolume: mongoose.Decimal128,
    ignored: String
});

const Kline = mongoose.model('Kline', klineSchema);

module.exports.Kline = Kline;