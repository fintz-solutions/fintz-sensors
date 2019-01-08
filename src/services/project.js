const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports.createProject = async function(projectData) {
    let result = requestValidation.isValidBody(["name", "numStations", "numRuns",
        "timePerRun", "productionTarget"
    ], projectData);

    if (result.status === true) {
        return projectModel.createNew(projectData);
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};

module.exports.getProject = async function(projectNumber) {
    return projectModel.findByProjectNumber(projectNumber).then(function(project) {
        if (!project) {
            errorUtil.createAndThrowGenericError(`Could not find the project specified by number: ${projectNumber}`,
                404);
        } else {
            //TODO: timestamp to date
            //TODO: clean project fields
            return project;
        }
    });
};

module.exports.deleteProject = async function(projectNumber) {
    return projectModel.deleteProjectByNumber(projectNumber);
};

module.exports.getProjects = async function() {
    return projectModel.find({}); //TODO NELSON maybe change to get active projects and filter by ones with an active status???
};
