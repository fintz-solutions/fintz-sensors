const path = require("path");
const modelsFolder = global.modelsFolder;
const sessionModel = require(path.resolve(modelsFolder, "session")).Session;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
module.exports = {
    getActiveSession : function (req, res, next) {
        sessionModel.findRunningSession().then(function (session) {
            if(session === null){
                let error = errorUtil.createGenericError("Could not find an active session", 404);
                responseUtil.sendErrorResponse(error, "Could not find an active session", null, res);
            } else {
                req.session = session;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, "Could not find an active session", null, res);
        });
    },
    getSession : function (req, res, next) {
        sessionModel.findBySessionNumber(req.params.sessionNumber).then(function (session) {
            if(session === null){
                let error = errorUtil.createGenericError(`Could not find session specified by number ${req.params.sessionNumber}`, 404);
                responseUtil.sendErrorResponse(error, `Could not find session specified by number ${req.params.sessionNumber}`, null, res);
            } else {
                req.session = session;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, `Could not find session specified by number ${req.params.sessionNumber}`, null, res);
        });
    }
};
