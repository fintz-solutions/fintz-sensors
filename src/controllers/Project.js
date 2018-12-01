const path = require("path");
const servicesFolder = path.resolve(global.projectRootFolder + "/services");
const projectService = require(servicesFolder + "/Project");

module.exports = {
    create: function (req, res) {
        return projectService.createProject(req.body);
    },
    
    get: function (req, res) {
        return projectService.getProject(req.params.id);
    },
    
    list: function (req, res) {
        return projectService.getProjects();
    },
    
    delete: function (req, res) {
        return projectService.deleteProject(req.params.id);
    }
};