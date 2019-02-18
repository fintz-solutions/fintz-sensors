const path = require("path");
const servicesFolder = global.servicesFolder;
const sessionService = require(path.resolve(servicesFolder, "session"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    create: function(req, res) {
        sessionService.createSession(req.body).then(function(data) {
            responseUtil.sendSuccessResponse("Session created successfully", 201, data, res);
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not create a new Session", null, res);
        });
    },

    get: function(req, res) {
        sessionService.getSession(req.params.sessionNumber).then(function(data) {
            if (req.get("Content-Type") === "application/json") {
                responseUtil.sendSuccessResponse("Session details retrieved successfully", 200, data, res);
            } else {
                data = JSON.parse(JSON.stringify(data));
                res.render("pages/session_show.html.tpl", {
                    title: "Session Details",
                    session: data
                });
            }
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not retrieve Session details", null, res);
        });
    },

    list: function(req, res) {
        sessionService.getSessions().then(function(data) {
            if (req.get("Content-Type") === "application/json") {
                responseUtil.sendSuccessResponse("Sessions retrieved successfully", 200, data, res);
            } else {
                res.render("pages/sessions.html.tpl", {
                    title: "Sessions List",
                    sessions: data
                });
            }
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not retrieve Sessions", null, res);
        });
    },

    delete: function(req, res) {
        sessionService.deleteSession(req.params.sessionNumber).then(function(data) {
            responseUtil.sendSuccessResponse("Session deleted successfully", 200, data, res);
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not delete Session", null, res);
        });
    }
};
