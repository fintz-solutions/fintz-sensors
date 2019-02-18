const path = require("path");
const servicesFolder = global.servicesFolder;
const runService = require(path.resolve(servicesFolder, "run"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    get: function (req, res) {
        runService.get(req.session, req.run, req.iteration, req.measurements).then(function (data) {
            if (req.get("Content-Type") === "application/json") {
                responseUtil.sendSuccessResponse("Run details retrieved successfully", 200, data, res);
            } else {
                res.render("pages/run_show.html.tpl", {
                    title: "Run Details",
                    session: data.session,
                    run: data.run,
                    iteration: data.iteration,
                    measurements: data.measurements
                });
            }
        }).catch(function (error) {
            responseUtil.sendErrorResponse(error, "Could not retrieve Run details", null, res);
        });
    },

    list: function (req, res) {

    },

    delete: function (req, res) {

    },

    update: function (req, res) {
        runService.update(req.session, req.run, req.iteration, req.measurements, req.body).then(function (data) {
            responseUtil.sendSuccessResponse("Run action parsed successfully", 200, data, res);
        }).catch(function (error) {
            responseUtil.sendErrorResponse(error, "Could not parse a Run action", null, res);
        });
    }
};
