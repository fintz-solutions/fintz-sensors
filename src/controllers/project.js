const path = require("path");
const servicesFolder = global.servicesFolder;
const projectService = require(path.resolve(servicesFolder, "project"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    create: function(req, res) {
        projectService.createProject(req.body).then(function(data) {
            responseUtil.sendSuccessResponse("Project created successfully", 201, data, res);
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not create a new Project", null, res);
        });
    },

    get: function(req, res) {
        projectService.getProject(req.params.id).then(function(data) {
            if (req.get("Content-Type") === "application/json") {
                responseUtil.sendSuccessResponse("Project details retrieved successfully", 200, data, res);
            } else {
                res.render("pages/project.html.tpl", {
                    title: "Project Details",
                    project: data
                });
            }
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not retrieve Project details", null, res);
        });
    },

    list: function(req, res) {
        projectService.getProjects().then(function(data) {
            if (req.get("Content-Type") === "application/json") {
                responseUtil.sendSuccessResponse("Projects retrieved successfully", 200, data, res);
            } else {
                res.render("pages/projects.html.tpl", {
                    title: "List Projects",
                    projects: data
                });
            }
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not retrieve Projects", null, res);
        });
    },

    delete: function(req, res) {
        projectService.deleteProject(req.params.id).then(function(data) {
            responseUtil.sendSuccessResponse("Project deleted successfully", 200, data, res);
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not delete Project", null, res);
        });
    }
};
