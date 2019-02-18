const path = require("path");
const modelsFolder = global.modelsFolder;
const sessionModel = require(path.resolve(modelsFolder, "session")).Session;
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
    },
    getLatestIteration: function (req, res, next) {
        req.run.findLatestIterationForRun().then(function (latestIteration) {
            req.iteration = latestIteration;
            next();
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, `Error when looking for the latest iteration for run with id: ${req.run._id}`, null, res);
        });
    }
};
