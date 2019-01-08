const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
module.exports = {
    getActiveMeasureForStationIteration : function (req, res, next) {
        //req.iteration;
        //req.project;
        //req.run;
        //req.stationNumber;
    }
};
