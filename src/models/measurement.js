let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Measurement = new Schema({
    stationNumber: Number,
    startTime: Date,
    stopTime: Date,
    iteration: model //will identify the number karts built
});

module.exports.Measurement = Measurement;
