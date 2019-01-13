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
                    return deletedIteration._doc;
                    /*
                    let promises = [];
                    promises.push(deletedIteration.deleteAssociatedMeasurementsForIteration());
                    //TODO NELSON delete associated measurements here deletedIteration.deleteAssociatedMeasurementsForIteration()
                    return Promise.all(promises, function (results) {
                        return deletedIteration._doc;
                    });
                     */
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


// -------- Instance methods -------- //
Iteration.methods.findMeasurementsForIteration = function() {
    let iterationObj = this;
    return measurementModel.findAllByIterationId(iterationObj._id);
};

module.exports.Iteration = mongoose.model("Iteration", Iteration);
