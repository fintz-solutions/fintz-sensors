const path = require("path");
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
module.exports = {
    isValidStationNumber : function (req, res, next) {
        if(req.body.stationNumber && Number.isInteger(req.body.stationNumber) && (req.body.stationNumber > 0 && req.body.stationNumber <= req.project.numStations)) {
            req.stationNumber = req.body.stationNumber;
            next();
        } else {
            let error = errorUtil.createGenericError("Invalid station number", 400);
            responseUtil.sendErrorResponse(error, "Invalid station number", null, res);
        }
    }
};
