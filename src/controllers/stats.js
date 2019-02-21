const path = require("path");
const servicesFolder = global.servicesFolder;
const statsService = require(path.resolve(servicesFolder, "stats"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    getRunStats: function (req, res) {

        let session = req.session._doc;
        let run = req.run._doc;
        let iterations = req.iterations;
        let events = req.events;

        if (req.get("Content-Type") === "application/json") {
            let data = statsService.getRunStats(session, run, iterations, events);
            responseUtil.sendSuccessResponse("Run stats retrieved successfully", 200, data, res);
        } else {
            res.render("pages/run_stats.html.tpl", {
                title: "Run Stats",
                session: {number: session.number},
                run: {number: run.number}
            });
        }
    },
    getSessionStats: function (req, res) {

        let session = req.session._doc;

        if (req.get("Content-Type") === "application/json") {
            let data = statsService.getSessionStats(session);
            responseUtil.sendSuccessResponse("Session Stats retrieved successfully", 200, data, res);
        } else {
            res.render("pages/session_stats.html.tpl", {
                title: "Session Stats",
                session: {number: session.number}
            });
        }
    }
};
