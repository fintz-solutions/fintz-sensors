const path = require("path");
const modelsFolder = global.modelsFolder;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports.createRun = async function(runData) {
    let result = requestValidation.isValidBody(["number", "startTimeStamp", "totalTime", "status", "project"
    ], runData);
    if (result.status === true) {
        return runModel.createNew(runData);
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};
