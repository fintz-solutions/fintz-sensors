const path = require("path");
const modelsFolder = global.modelsFolder;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const iterationModel = require(path.resolve(modelsFolder, "iteration")).Project;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
module.exports = {
    getActiveMeasureForStationIteration : function (req, res, next) {
        //req.iteration;
        //req.project;
        //req.run;
        //req.stationNumber;
    },
    getIterationMeasurements: function (req, res, next) {
        if(req.iteration) {
            req.iteration.findMeasurementsForIteration().then(function (measurements) {
                req.measurements = measurements;
                next();
            }).catch(function(error) {
                console.error(error);
                responseUtil.sendErrorResponse(error, `Error when looking for measurements for iteration with id ${req.iteration._id}`, null, res);
            });
        } else {
            req.measurements = [];
            next();
        }
    }
};
