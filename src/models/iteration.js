let mongoose = require("mongoose");
let path = require("path");
let Schema = mongoose.Schema;
const measurementModel = require(path.resolve(modelsFolder, "measurement")).Measurement;


let Iteration = new Schema({
    number: {
        type: Number,
        required: true
    },
    startTime: {//TIMESTAMP
        type: Number
        //required: true //TODO NELSON
    },
    stopTime: {//TIMESTAMP
        type: Number
        //required: true //TODO NELSON
    },
    run: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Run',
        required: true
    }
});

// -------- Static methods -------- //
Iteration.statics.deleteIterationById = function (iterationId) {
    return this.findById(iterationId).then(function (iteration) {
        if (iteration && iteration._doc) {
            return iteration.remove().then(function (deletedIteration) {
                if (deletedIteration && deletedIteration._doc) {
                    let promises = [];
                    promises.push(deletedIteration.deleteAssociatedMeasurementsForIteration());
                    return Promise.all(promises).then(function (results) {
                        return deletedIteration._doc;
                    });
                } else {
                    return null;
                }
            });
        } else {
            errorUtil.createAndThrowGenericError("Invalid Iteration", 404);
        }
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid iteration", 404);
    });
};

Iteration.statics.createAndInitializeIteration = function(iteration, numStations){
    return this.create(iteration).then(function(newIteration){
        let measurementsArray = [];
        for (let it = 1; it <= numStations; it++) {
            let measurementData = {
                stationNumber: it,
                startTime: null,
                stopTime: null,
                iteration: newIteration._doc._id
            };
            measurementsArray.push(measurementData);
        }
        return measurementModel.insertMany(measurementsArray).then(function (results) {
            return newIteration;
        });
    });
};

// -------- Instance methods -------- //
Iteration.methods.findMeasurementsForIteration = function() {
    let iterationObj = this;
    return measurementModel.findAllByIterationId(iterationObj._id);
};

Iteration.methods.deleteAssociatedMeasurementsForIteration = function() {
    let deletedIteration = this;
    return deletedIteration.findMeasurementsForIteration().then(function(measurementsToDelete) {
        let promises = [];
        measurementsToDelete.forEach(function(measurementToDelete, index) {
            promises.push(measurementModel.deleteMeasurementById(measurementToDelete.id));
        });
        return Promise.all(promises).then(function(results) {
            return deletedIteration._doc;
        });
    });
};

module.exports.Iteration = mongoose.model("Iteration", Iteration);
