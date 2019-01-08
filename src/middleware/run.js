const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
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
    }
};
