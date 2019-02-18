const path = require("path");
const modelsFolder = global.modelsFolder;
const sessionModel = require(path.resolve(modelsFolder, "session")).Session;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports = {
    getActiveRun : function (req, res, next) {
        req.session.findActiveRunForSession().then(function (activeRun) {
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
        req.session.findRunByNumberForSession(req.params.runNumber).then(function (run) {
            if(run === null){
                let error = errorUtil.createGenericError(`Could not find a run with number ${req.params.runNumber} for session with number ${req.session.number}`, 404);
                responseUtil.sendErrorResponse(error, `Could not find a run with number ${req.params.runNumber} for session with number ${req.session.number}`, null, res);
            } else {
                req.run = run;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, `Could not find a run with number ${req.params.runNumber} for session with number ${req.session.number}`, null, res);
        });
    }
};
