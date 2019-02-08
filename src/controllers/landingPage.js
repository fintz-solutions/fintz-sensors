const path = require("path");
const servicesFolder = global.servicesFolder;
const projectService = require(path.resolve(servicesFolder, "project"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    show: function(req, res) {
        projectService.getProjects().then(function(data) {
            res.render("pages/landing.html.tpl", {
                title: global.appTitle,
                projects: data,
                isHomepage: true
            });
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not build landing page", null, res);
        });
    }
};
