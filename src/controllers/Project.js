const path = require("path");
const servicesFolder = path.resolve(global.projectRootFolder + "/services");
const projectService = require(servicesFolder + "/Project");

module.exports = {
    create: function (req, res) {
        return projectService.createProject(req.body);
    },
    
    get: function (req, res) {
        
    },
    
    list: function (req, res) {
        
    },
    
    delete: function (req, res) {
        
    }
};