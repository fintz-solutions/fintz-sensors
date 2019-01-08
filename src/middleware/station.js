const path = require("path");
const responseUtil = require(path.resolve(global.utilsFolder, "response"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
module.exports = {
    isValidStationNumber : function (req, res, next) {
        let stationNumber = req.body.stationNumber && parseInt(req.body.stationNumber);
        if(stationNumber > 0 && stationNumber <= req.project.numStations) {
            req.stationNumber = stationNumber;
            next();
        } else {
            let error = errorUtil.createGenericError("Invalid station number", 400);
            responseUtil.sendErrorResponse(error, "Invalid station number", null, res);
        }
    }
};
