const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports = {
    getActiveRun : function (req, res, next) {
        req.project.findActiveRunForProject().then(function (activeRun) {
            if(activeRun === null){
                let error = errorUtil.createGenericError("Could not find an active run", 404);
                responseUtil.sendErrorResponse(error, "Could not find an active run", null, res);
            } else {
                req.run = activeRun;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, "Could not find an active run", null, res);
        });
    },
    getRun : function (req, res, next) {
        req.project.findRunByNumberForProject(req.params.runNumber).then(function (run) {
            if(run === null){
                let error = errorUtil.createGenericError(`Could not find a run with number ${req.params.runNumber} for project with number ${req.project.number}`, 404);
                responseUtil.sendErrorResponse(error, `Could not find a run with number ${req.params.runNumber} for project with number ${req.project.number}`, null, res);
            } else {
                req.run = run;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, `Could not find a run with number ${req.params.runNumber} for project with number ${req.project.number}`, null, res);
        });
    }
};
