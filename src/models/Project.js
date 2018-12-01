let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Project = new Schema({
    projectName: String,
    number:  Number,
    createdAt: Date,//TODO NELSON test this, mongo already add this on creation
    numStations:   Number,
    numRuns: Number,
    timePerRun: Number,
    productionTarget: Number,//target number of karts per run
    status: Number //status of the project // TODO NELSON see enums for accepted types (1,2,3)
 });


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

module.exports.Project = mongoose.model("Project", Project);

//TODO NELSON create instance & static methods
//static createNewProject
//instance method updateProject