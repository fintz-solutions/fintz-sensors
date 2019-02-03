const path = require("path");
const modelsFolder = global.modelsFolder;
const measurementModel = require(path.resolve(modelsFolder, "measurement")).Measurement;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const iterationModel = require(path.resolve(modelsFolder, "iteration")).Project;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));

module.exports = {
    getActiveMeasureForStationIteration : function (req, res, next) {
        let result = requestValidation.isValidBody(["stationNumber"], req.body);
        if (result.status === false) {
            errorUtil.createAndThrowGenericError(result.message, 400);
        }

        let iterationId = req.iteration._doc._id;
        let station = req.body.stationNumber;

        measurementModel.findByIterationIdAndStation(iterationId, station).then(function (measurement) {
            if(measurement === null){
                let error = errorUtil.createGenericError("Could not find the respective measurement", 404);
                responseUtil.sendErrorResponse(error, "Could not find the respective measurement", null, res);
            } else {
                req.measurement = measurement;
                next();
            }
        }).catch(function(error) {
            console.error(error);
            responseUtil.sendErrorResponse(error, "Could not find the respective measurement", null, res);
        });
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
