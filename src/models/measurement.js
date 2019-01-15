let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Measurement = new Schema({
    stationNumber: {
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
    iteration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iteration',
        required: true
    }
});


// -------- Static methods -------- //
Measurement.statics.findAllByIterationId = function (iterationId) {
    return this.find({
        iteration: iterationId
    });
};

// -------- Instance methods -------- //
//TODO NELSON



module.exports.Measurement = mongoose.model("Measurement", Measurement);
