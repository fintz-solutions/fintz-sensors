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

// -------- Static methods -------- //
Iteration.statics.deleteIterationById = function (iterationId) {
    //TODO NELSON don't forget to also delete related measurements
    return this.findById(iterationId).then(function (iteration) {
        if (iteration && iteration._doc) {
            return iteration.remove().then(function (deletedIteration) {
                if (deletedIteration && deletedIteration._doc) {
                    //TODO NELSON delete associated measurements
                    return deletedIteration._doc;
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

module.exports.Iteration = mongoose.model("Iteration", Iteration);
