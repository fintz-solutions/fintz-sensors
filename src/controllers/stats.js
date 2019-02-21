const path = require("path");
const servicesFolder = global.servicesFolder;
const statsService = require(path.resolve(servicesFolder, "stats"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    getRunStats: function (req, res) {

        if (req.get("Content-Type") === "application/json") {
            let data = statsService.getRunStats(req.session._doc, req.run._doc, req.iterations, req.events);
            responseUtil.sendSuccessResponse("Run stats retrieved successfully", 200, data, res);
        } else {
            res.render("pages/runs_stats.html.tpl", {
                title: "Runs Stats"
            });
        }
    },
    getSessionStats: function (req, res) {

        if (req.get("Content-Type") === "application/json") {
            let data = statsService.getSessionStats(req.session._doc);
            responseUtil.sendSuccessResponse("Session Stats retrieved successfully", 200, data, res);
        } else {
            res.render("pages/session_stats.html.tpl", {
                title: "Session Stats"
            });
        }
    }
};
