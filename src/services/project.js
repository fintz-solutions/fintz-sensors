const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports.createProject = async function(projectData) {
    let result = requestValidation.isValidBody(["name", "numStations", "numRuns",
        "timePerRun", "productionTarget", "status"
    ], projectData);

    if (result.status === true) {
        return projectModel.createNew(projectData);
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};

module.exports.getProject = async function(projectId) {
    return projectModel.findByProjectId(projectId).then(function(project) {
        if (!project) {
            errorUtil.createAndThrowGenericError(`Could not find the project specified by id: ${projectId}`,
                404);
        } else {
            return project;
        }
    });
};

module.exports.deleteProject = async function(projectId) {
    return projectModel.deleteProjectById(projectId);
};

module.exports.getProjects = async function() {
    return projectModel.find({}); //TODO NELSON maybe change to get active projects and filter by ones with an active status???
};
