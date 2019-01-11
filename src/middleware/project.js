const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
module.exports = {
    getActiveProject : function (req, res, next) {
        projectModel.findRunningProject().then(function (project) {
            if(project === null){
                let error = errorUtil.createGenericError("Could not find an active project", 404);
                responseUtil.sendErrorResponse(error, "Could not find an active project", null, res);
            } else {
                req.project = project;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, "Could not find an active project", null, res);
        });
    },
    getProject : function (req, res, next) {
        projectModel.findByProjectNumber(req.params.projectNumber).then(function (project) {
            if(project === null){
                let error = errorUtil.createGenericError(`Could not find project specified by number ${req.params.number}`, 404);
                responseUtil.sendErrorResponse(error, `Could not find project specified by number ${req.params.number}`, null, res);
            } else {
                req.project = project;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, `Could not find project specified by number ${req.params.number}`, null, res);
        });
    }
};
