let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Run = new Schema({
    number:  Number,
    startTimeStamp: Date,//TODO NELSON ver timestamps
    totalTime:   Number,// in minutes
    status: Number,//TODO NELSON see the enums
    project: model,//TODO NELSON see how to connect to project model
    currentIteration: Number
});

module.exports.Run = Run;