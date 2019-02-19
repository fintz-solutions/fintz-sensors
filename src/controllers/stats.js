const path = require("path");
const servicesFolder = global.servicesFolder;
const statsService = require(path.resolve(servicesFolder, "stats"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    getRunStats: function (req, res) {
        let data = statsService.getRunStats(req.session._doc, req.run._doc, req.iterations);

        if (req.get("Content-Type") === "application/json") {
            responseUtil.sendSuccessResponse("Run stats retrieved successfully", 200, data, res);
        } else {
            data = data.map(function(element){
                return JSON.stringify(element);
            });
            res.render("pages/run_stats.html.tpl", {
                title: "Run Stats",
                stats: data
            });
        }
    },
    getSessionStats: function (req, res) {
        let data = statsService.getSessionStats(req.session._doc);

        if (req.get("Content-Type") === "application/json") {
            responseUtil.sendSuccessResponse("Session Stats retrieved successfully", 200, data, res);
        } else {
            data = JSON.stringify(data);
            res.render("pages/session_stats.html.tpl", {
                title: "Session Stats",
                stats: data
            });
        }
    }
};
