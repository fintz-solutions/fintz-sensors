const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
module.exports = {
    getActiveIteration : function (req, res, next) {
        req.run.findActiveIterationForRun().then(function (activeIteration) {
            if(activeIteration === null){
                let error = errorUtil.createGenericError("Could not find an active Iteration", 404);
                responseUtil.sendErrorResponse(error, "Could not find an active iteration", null, res);
            } else {
                req.iteration = activeIteration;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, "Could not find an active iteration", null, res);
        });
    }
};