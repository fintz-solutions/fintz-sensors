const path = require("path");
const servicesFolder = global.servicesFolder;
const runService = require(path.resolve(servicesFolder, "run"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    get: function(req, res) {

    },

    list: function(req, res) {

    },

    delete: function(req, res) {

    },

    update: function (req, res) {
        runService.update(req.project, req.run, req.iteration, req.measurements, req.body).then(function(data) {
            responseUtil.sendSuccessResponse("Run action parsed successfully", 200, data, res);
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not parse a Run action", null, res);
        });
    }
};
