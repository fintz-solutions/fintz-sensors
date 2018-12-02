let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = path.resolve(global.projectRootFolder + "/models");
const runModel = require(modelsFolder + "/Run").Run;

let Project = new Schema({
    projectName: String,
    number:  Number,
    createdAt: Date,//TODO NELSON test this, mongo already adds this on creation? -> nope
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
        return newProject._doc;
    });
};

Project.statics.findByProjectId = function(projectId) {
    return this.findById(projectId).then(function (project) {
        return project && project._doc ? project._doc : null;
    }).catch(function (error) {
        console.error(error);
        let errorObject = new Error("Invalid Project");
        errorObject.statusCode = 404;
        throw errorObject;
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
            let errorObject = new Error("Invalid Project");
            errorObject.statusCode = 404;
            throw errorObject;
        }
    }).catch(function (error) {
        console.error(error);
        let errorObject = new Error("Invalid Project");
        errorObject.statusCode = 404;
        throw errorObject;
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