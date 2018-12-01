const path = require("path");
const modelsFolder = path.resolve(global.projectRootFolder + "/models");
const projectModel = require(modelsFolder + "/Project").Project;

module.exports.createProject = async function (projectData) {
    if(!projectData) {
        let errorObj = new Error("Project data cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.projectName) {
        let errorObj = new Error("Project projectName cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.number) {
        let errorObj = new Error("Project number cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.createdAt) {
        let errorObj = new Error("Project createdAt cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.numStations) {
        let errorObj = new Error("Project numStations cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.numRuns) {
        let errorObj = new Error("Project numRuns cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.timePerRun) {
        let errorObj = new Error("Project timePerRun cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.productionTarget) {
        let errorObj = new Error("Project productionTarget cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!projectData.status) {
        let errorObj = new Error("Project status cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else {
        return projectModel.createNew(projectData);
    }
    /*
        projectName: String,
        number:  Number,
        createdAt: Date,//TODO NELSON test this, mongo already add this on creation
        numStations:   Number,
        numRuns: Number,
        timePerRun: Number,
        productionTarget: Number,//target number of karts per run
        status: Number //status of the project // TODO NELSON see enums for accepted types (1,2,3)
    */
};

