const path = require("path");
const servicesFolder = global.servicesFolder;
const timerService = require(path.resolve(servicesFolder, "timer"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports.processTimerEvent = function(io, req, res) {
    console.log("timer event");

    timerService.processTimerEvent(req.session._doc, req.run._doc, req.iteration._doc, req.measurement).then(function(timerUpdateData) {

        //if(io.sockets.connected. ...) { // TODO validate if exists 1+ socket connections?
        io.emit("toggleTimer", timerUpdateData);

        responseUtil.sendSuccessResponse("Timer event processed successfully", 200, timerUpdateData, res);
    }).catch(function(error) {
        responseUtil.sendErrorResponse(error, "Could not process timer event", null, res);
    });
};
