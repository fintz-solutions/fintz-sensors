const path = require("path");
const modelsFolder = path.resolve(global.projectRootFolder + "/models");
const runModel = require(modelsFolder + "/Run").Run;

module.exports.createRun = async function (runData) {
    if(!runData) {
        let errorObj = new Error("Run data cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!runData.number) {
        let errorObj = new Error("Run number cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!runData.startTimeStamp) {
        let errorObj = new Error("Run startTimeStamp cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!runData.totalTime) {
        let errorObj = new Error("Run totalTime cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!runData.status) {
        let errorObj = new Error("Run status cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!runData.project) {
        let errorObj = new Error("Run project cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else if (!runData.currentIteration) {
        let errorObj = new Error("Run currentIteration cannot be null");
        errorObj.statusCode = 400;
        throw errorObj;
    } else {
        return runModel.createNew(runData);
    }
};

