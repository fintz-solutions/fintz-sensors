let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let Iteration = new Schema({
    number: {
        type: Number,
        required: true
    },
    startTime: {//TIMESTAMP
        type: Number,
        required: true
    },
    stopTime: {//TIMESTAMP
        type: Number,
        required: true
    },
    run: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Run',
        required: true
    }
});

module.exports.Iteration = mongoose.model("Iteration", Iteration);