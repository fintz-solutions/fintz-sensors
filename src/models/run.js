let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = global.modelsFolder;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));
const iterationModel = require(path.resolve(modelsFolder, "iteration")).Iteration;

let Run = new Schema({
    number: {
        type: Number,
        required: true
    },
    startTimestamp: {//TIMESTAMP
        type: Number,
        required: true
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

Run.statics.createNew = function (runData) {
    let run = this;
    const projectModel = require(path.resolve(modelsFolder, "project")).Project; //NELSON: Needed to add this require here because if not circular dependency problems would occur
    return projectModel.findByProjectId(runData.project).then(function (project) {
        if (!project) {
            errorUtil.createAndThrowGenericError("Invalid Project", 400);
        } else {
            return run.create(runData).then(function (newRun) {
                return newRun._doc;
            });
        }
    });
};

Run.statics.deleteRunById = function (runId) {
    //TODO NELSON don't forget to also delete related iterations and events
    return this.findById(runId).then(function (run) {
        if (run && run._doc) {
            return run.remove().then(function (deletedRun) {
                if (deletedRun && deletedRun._doc) {
                    //TODO NELSON will have to be a promise.all here
                    let promises = [];
                    promises.push(deletedRun.deleteAssociatedIterationsForRun());
                    //TODO NELSON DELETE ASSOCIATED Events here deletedRun.deleteAssociatedEventsForRun()
                    return Promise.all(promises, function (results) {
                        return deletedRun._doc;
                    });
                    //return deletedRun._doc;
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
Run.methods.findActiveIterationForRun = function () {
    let runObj = this;
    return iterationModel.findOne({
        run: runObj._id,
        startTime: {$ne: null},
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

Run.methods.deleteAssociatedIterationsForRun = function() {
    let deletedRun = this;
    return deletedRun.findAllIterationsForRun().then(function(iterationsToDelete) {
        let promises = [];
        iterationsToDelete.forEach(function(iterationToDelete, index) {
            promises.push(iterationModel.deleteIterationById(iterationToDelete.id));
        });
        return Promise.all(promises).then(function(results) {
            return deletedRun._doc;
        });
    });
};

module.exports.Run = mongoose.model("Run", Run);
