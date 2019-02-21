const path = require("path");
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    getRunEvents : function(req, res, next){
        req.run.findAllEventsForRun().then(function(events){
            req.events = events;
            next();
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, `Error when looking for the events for run with id: ${req.run._id}`, null, res);
        });
    }
};