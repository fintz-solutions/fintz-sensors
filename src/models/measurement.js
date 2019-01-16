let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Measurement = new Schema({
    stationNumber: {
        type: Number,
        required: true
    },
    startTime: {//TIMESTAMP
        type: Number,
        required: false
    },
    stopTime: {//TIMESTAMP
        type: Number,
        required: false
    },
    iteration: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Iteration',
        required: true
    }
});

Measurement.statics.update = function() {
    let measurement = this;
    measurement.save(); // TODO error handling
    //return event.create(eventData).then(function(newEvent) {
    //    return newEvent._doc;
    //});
};
Measurement.methods.update = function() {
    this.save(); // TODO error handling
};

Measurement.statics.findByIterationIdAndStation = function (iterationId, stationNumber) {
    return this.findOne({
        iteration: iterationId,
        stationNumber: stationNumber
    }).then(function(measurement) {
        return measurement;
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Measurement", 404);
    });
};

module.exports.Measurement = mongoose.model("Measurement", Measurement);
