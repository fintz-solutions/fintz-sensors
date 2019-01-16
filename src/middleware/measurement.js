const path = require("path");
const modelsFolder = global.modelsFolder;
const measurementModel = require(path.resolve(modelsFolder, "measurement")).Measurement;
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports = {
    getActiveMeasureForStationIteration : function (req, res, next) {
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
    }
};
