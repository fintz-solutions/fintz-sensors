let mongoose = require('mongoose');
const path = require("path");
let Schema = mongoose.Schema;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

let Measurement = new Schema({
    stationNumber: {
        type: Number,
        required: true
    },
    startTime: {//TIMESTAMP
        type: Number,
        required: false // TODO JORGE check this
    },
    stopTime: {//TIMESTAMP
        type: Number,
        required: false // TODO JORGE check this
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
    }).then(function(measurements){
        return measurements;
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Measurements", 404);
    });
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

Measurement.statics.deleteMeasurementById = function (measurementId) {
    return this.findById(measurementId).then(function(measurement) {
        return measurement.remove();
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not delete measurement with id: ${measurementId}`, 404);
    });
};

// -------- Instance methods -------- //
//TODO NELSON

module.exports.Measurement = mongoose.model("Measurement", Measurement);
