let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = path.resolve(global.projectRootFolder + "/models");

let Run = new Schema({
    number:  Number,
    startTimeStamp: Date,//TODO NELSON ver timestamps
    totalTime:   Number,// in minutes
    status: {
        type: String,
        enum : ['CREATED','RUNNING', 'FINISHED'],
        default: 'CREATED'
    },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    currentIteration: Number
});

Run.statics.createNew = function(runData) {
    let run = this;
    const projectModel = require(modelsFolder + "/Project").Project;//NELSON: Needed to add this require here because if not circular dependency problems would occur
    return projectModel.findByProjectId(runData.project).then(function (project) {
        if(!project) {
            let errorObj = new Error("Invalid Project");
            errorObj.statusCode = 400;
            throw errorObj;
        } else {
            return run.create(runData).then(function (newRun) {
                return newRun._doc;
            });
        }
    });
};

Run.statics.deleteRunById = function(runId) {
    //TODO NELSON don't forget to also delete related iterations and events
    return this.findById(runId).then(function (run) {
        if(run && run._doc) {
            return run.remove().then(function (deletedRun) {
                if(deletedRun && deletedRun._doc) {
                    //TODO NELSON
                    //iterationModel.deleteIterationById();//non-blocking delete;
                    //eventModel.deleteEventById();//non-blocking delete;
                    return deletedRun._doc;
                } else {
                    return null;
                }
            });
        } else {
            let errorObject = new Error("Invalid Run");
            errorObject.statusCode = 404;
            throw errorObject;
        }
    }).catch(function (error) {
        console.error(error);
        let errorObject = new Error("Invalid Run");
        errorObject.statusCode = 404;
        throw errorObject;
    });
};

module.exports.Run = mongoose.model("Run", Run);