const path = require("path");
const servicesFolder = global.servicesFolder;
const statsService = require(path.resolve(servicesFolder, "stats"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    getRunStats: function (req, res) {
        let data = statsService.getRunStats(req.project._doc, req.run._doc, req.iterations);

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
    getProjectStats: function (req, res) {
        let data = statsService.getProjectStats(req.project._doc);

        if (req.get("Content-Type") === "application/json") {
            responseUtil.sendSuccessResponse("Project Stats retrieved successfully", 200, data, res);
        } else {
            data = JSON.stringify(data);
            res.render("pages/project_stats.html.tpl", {
                title: "Project Stats",
                stats: data
            });
        }
    }
};