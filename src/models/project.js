let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = global.modelsFolder;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

let Project = new Schema({
    projectName: String,
    number:  Number,
    createdAt: Date,
    numStations:   Number,
    numRuns: Number,
    timePerRun: Number,
    productionTarget: Number,//target number of karts per run
    status: {
        type: String,
        enum : ['CREATED','RUNNING', 'FINISHED'],
        default: 'CREATED'
    }
 });


// -------- Static methods -------- //

Project.statics.createNew = function(projectData) {
    return this.create(projectData).then(function (newProject) {
        //return newProject._doc;
        let promises = [];
        //TODO NELSON this code must be revised
        for(let runNumber = 1; runNumber <= newProject._doc.numRuns; runNumber++) {
            let runData = {
                number:  runNumber,
                startTimeStamp: newProject._doc.createdAt,
                totalTime:   newProject._doc.timePerRun,
                status: "CREATED",
                project: newProject._doc._id,
                currentIteration: 1//Because these are created when creating a new project
            };
            promises.push(runModel.createNew(runData));
        }
        return Promise.all(promises).then(function (results) {
            return newProject._doc;
        });
    });
};

Project.statics.findByProjectId = function(projectId) {
    return this.findById(projectId).then(function (project) {
        return project && project._doc ? project._doc : null;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Project", 404);
    });
};

Project.statics.deleteProjectById = function(projectId) {
    return this.findById(projectId).then(function (project) {
        if(project && project._doc) {
            return project.remove().then(function (deletedProject) {
                if(deletedProject && deletedProject._doc) {
                    return deletedProject.deleteAssociatedRunsForProject();
                } else {
                    return null;
                }
            });
        } else {
            errorUtil.createAndThrowGenericError("Invalid Project", 404);
        }
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Project", 404);
    });
};


// -------- Instance methods -------- //


Project.methods.findAllRunsForProject = function() {
    let projectObj = this;
    return runModel.find({project: projectObj._id});
};

Project.methods.deleteAssociatedRunsForProject = function() {
    let deletedProject = this;
    return deletedProject.findAllRunsForProject().then(function (runsToDelete) {
        let promises = [];
        runsToDelete.forEach(function (runToDelete, index) {
            promises.push(runModel.deleteRunById(runToDelete.id));
        });
        return Promise.all(promises).then(function (results) {
            return deletedProject._doc;
        });
    });
};

module.exports.Project = mongoose.model("Project", Project);