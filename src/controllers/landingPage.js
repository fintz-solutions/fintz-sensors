const path = require("path");
const servicesFolder = global.servicesFolder;
const sessionService = require(path.resolve(servicesFolder, "session"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    show: function(req, res) {
        sessionService.getSessions().then(function(data) {
            res.render("pages/landing.html.tpl", {
                title: global.appTitle,
                sessions: data,
                isHomepage: true
            });
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not build landing page", null, res);
        });
    }
};
