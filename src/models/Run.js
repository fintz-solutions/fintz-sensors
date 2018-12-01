let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = path.resolve(global.projectRootFolder + "/models");
const projectModel = require(modelsFolder + "/Project").Project;

let Run = new Schema({
    number:  Number,
    startTimeStamp: Date,//TODO NELSON ver timestamps
    totalTime:   Number,// in minutes
    status: Number,//TODO NELSON see the enums
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    currentIteration: Number
});

Run.statics.createNew = function(runData) {
    let run = this;
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

module.exports.Run = mongoose.model("Run", Run);