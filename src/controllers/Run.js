const path = require("path");
const servicesFolder = path.resolve(global.projectRootFolder + "/services");
const runService = require(servicesFolder + "/Run");

module.exports = {
    create: function (req, res) {
        return runService.createRun(req.body);
    },

    get: function (req, res) {

    },

    list: function (req, res) {

    },

    delete: function (req, res) {

    }
};