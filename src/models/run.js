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
    startTimeStamp: {//TIMESTAMP
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

Run.statics.createNew = function(runData) {
    let run = this;
    const projectModel = require(path.resolve(modelsFolder, "project")).Project; //NELSON: Needed to add this require here because if not circular dependency problems would occur
    return projectModel.findByProjectId(runData.project).then(function(project) {
        if (!project) {
            errorUtil.createAndThrowGenericError("Invalid Project", 400);
        } else {
            return run.create(runData).then(function(newRun) {
                return newRun._doc;
            });
        }
    });
};

Run.statics.deleteRunById = function(runId) {
    //TODO NELSON don't forget to also delete related iterations and events
    return this.findById(runId).then(function(run) {
        if (run && run._doc) {
            return run.remove().then(function(deletedRun) {
                if (deletedRun && deletedRun._doc) {
                    //TODO NELSON
                    //iterationModel.deleteIterationById();//non-blocking delete;
                    //eventModel.deleteEventById();//non-blocking delete;
                    return deletedRun._doc;
                } else {
                    return null;
                }
            });
        } else {
            errorUtil.createAndThrowGenericError("Invalid Run", 404);
        }
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Run", 404);
    });
};

Run.statics.findByRunId = function(runId) {
    return this.findById(runId).then(function(run) {
        return run && run._doc ? run._doc : null;
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Run", 404);
    });
};

// -------- Instance methods -------- //
Run.methods.findActiveIterationForRun = function() {
    let runObj = this;
    return iterationModel.findOne({run: runObj._id, stopTime: null}).then(function (activeIteration) {
        return activeIteration; // && activeIteration._doc ? activeIteration._doc : null;//TODO NELSON might have to return the entire thing instead of just _.doc so that we are able to call the instance methods of the retrieved object
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not find an active iteration for run with number ${runObj.number} for project with number ${runObj.project}`, 404);
    });
};

module.exports.Run = mongoose.model("Run", Run);
