const path = require("path");
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));

module.exports.processTimerEvent = async function(project, run, iteration, measurement) {

    if(measurement.startTime === null){
        measurement.startTime = dateUtil.getCurrentTimestamp();
        measurement.save();

        // measurement data update
        return {
            station: measurement.stationNumber,
            operation: "start"
        };
    }
    else {
        if(measurement.stopTime === null){
            measurement.stopTime = dateUtil.getCurrentTimestamp();
            measurement.save();

            // measurement data update
            return {
                station: measurement.stationNumber,
                operation: "stop"
            };
        }
        else {
            measurement.stopTime = null;
            measurement.save();

            let currentTime = dateUtil.getCurrentTimestamp() - measurement.startTime;

            // measurement data update
            return {
                station: measurement.stationNumber,
                operation: "start",
                currentTime: currentTime
            };
        }
    }
};
