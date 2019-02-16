let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = global.modelsFolder;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));
const iterationModel = require(path.resolve(modelsFolder, "iteration")).Iteration;
const eventModel = require(path.resolve(modelsFolder, "event")).Event;

let Run = new Schema({
    number: {
        type: Number,
        required: true
    },
    startTimestamp: {//TIMESTAMP
        type: Number
        //required: true TODO NELSON
    },
    totalTime: {// in minutes
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['CREATED', 'RUNNING', 'FINISHED'],
        default: 'CREATED'
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    }
});

Run.statics.deleteRunById = function (runId) {
    return this.findById(runId).then(function (run) {
        if (run && run._doc) {
            return run.remove().then(function (deletedRun) {
                if (deletedRun && deletedRun._doc) {
                    let promises = [];
                    promises.push(deletedRun.deleteAssociatedIterationsForRun());
                    promises.push(deletedRun.deleteAssociatedEventsForRun());
                    return Promise.all(promises).then(function (results) {
                        return deletedRun._doc;
                    });
                } else {
                    return null;
                }
            });
        } else {
            errorUtil.createAndThrowGenericError("Invalid Run", 404);
        }
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Run", 404);
    });
};

Run.statics.findByRunId = function (runId) {
    return this.findById(runId).then(function (run) {
        return run && run._doc ? run._doc : null;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Run", 404);
    });
};


Run.statics.findAllByProjectId = function (projectId, fetchIterations) {
    if (fetchIterations === true) {
        return this.find({
            project: projectId
        }).then(function (runs) {
            let promises = [];
            runs.forEach(function (run) {
                promises.push(run.findAllIterationsForRun().then(function (iterations) {
                    run._doc.iterations = iterations;
                    return run;
                }));
            });

            return Promise.all(promises).then(function (runsWithIterations) {
                return runsWithIterations;
            });
        });
    } else {
        return this.find({
            project: projectId
        });
    }
};

// -------- Instance methods -------- //
Run.methods.findLatestIterationForRun = function () {
    let runObj = this;
    return iterationModel.findOne({
        run: runObj._id
    }).sort({_id: -1}).then(function (activeIteration) {
        return activeIteration;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not find an active iteration for run with number ${runObj.number} for project with id ${runObj.project}`, 404);
    });
};

Run.methods.findActiveIterationForRun = function () {
    let runObj = this;
    return iterationModel.findOne({
        run: runObj._id,
        startTime: {$ne: null}, // TODO JORGE check this
        stopTime: null
    }).sort({_id: -1}).then(function (activeIteration) {
        return activeIteration;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not find an active iteration for run with number ${runObj.number} for project with id ${runObj.project}`, 404);
    });
};

Run.methods.findAllIterationsForRun = function () {
    let runObj = this;
    return iterationModel.find({run: runObj._id}).then(function (iterations) {
        return iterations;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not find all iterations for run with number ${runObj.number} for project with id ${runObj.project}`, 404);
    });
};

Run.methods.findAllEventsForRun = function () {
    let runObj = this;
    return eventModel.find({run: runObj._id}).then(function (events) {
        return events;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not find all events for run with number ${runObj.number} for project with id ${runObj.project}`, 404);
    });
};

Run.methods.deleteAssociatedIterationsForRun = function () {
    let deletedRun = this;
    return deletedRun.findAllIterationsForRun().then(function (iterationsToDelete) {
        let promises = [];
        iterationsToDelete.forEach(function (iterationToDelete, index) {
            promises.push(iterationModel.deleteIterationById(iterationToDelete.id));
        });
        return Promise.all(promises).then(function (results) {
            return deletedRun._doc;
        });
    });
};

Run.methods.deleteAssociatedEventsForRun = function () {
    let deletedRun = this;
    return deletedRun.findAllEventsForRun().then(function (eventsToDelete) {
        let promises = [];
        eventsToDelete.forEach(function (eventToDelete, index) {
            promises.push(eventModel.deleteEventById(eventToDelete.id));
        });
        return Promise.all(promises).then(function (results) {
            return deletedRun._doc;
        });
    });
};

Run.methods.createNewIterationForRun = function (previousIterationNumber, createWithStartTime, numStations) {
    let runObj = this;
    let iterationNumber = previousIterationNumber ? previousIterationNumber + 1 : 1;
    let iterationStartTime = createWithStartTime ? dateUtil.getCurrentTimestamp() : null;

    return iterationModel.createAndInitializeIteration({
        number: iterationNumber,
        startTime: iterationStartTime,
        run: runObj._doc._id
        },
        numStations);
};

module.exports.Run = mongoose.model("Run", Run);
