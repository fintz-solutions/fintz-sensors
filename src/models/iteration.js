let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Iteration = new Schema({
    iterationNumber:  Number, //TODO NELSON see autoincrement
    startTime: Date,
    stopTime: Date,
    run: model
});

module.exports.Iteration = Iteration;