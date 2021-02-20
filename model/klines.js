const mongoose = require('mongoose');

const klineSchema = new mongoose.Schema({
    startTime: Number,
    endTime: Number,
    symbol: String,
    interval: String,
    firstTradeId: Number,
    lastTradeId: Number,
    open: mongoose.Decimal128,
    close: mongoose.Decimal128,
    high: mongoose.Decimal128,
    low: mongoose.Decimal128,
    volume: mongoose.Decimal128,
    trades: Number,
    final: Boolean,
    quoteVolume: mongoose.Decimal128,
    volumeActive: mongoose.Decimal128,
    quoteVolumeActive: mongoose.Decimal128,
    ignored: String
});

const Kline = mongoose.model('Kline', klineSchema);

module.exports.Kline = Kline;