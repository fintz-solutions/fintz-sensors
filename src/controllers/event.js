const path = require("path");
const servicesFolder = global.servicesFolder;
const eventService = require(path.resolve(servicesFolder, "event"));
const responseUtil = require(path.resolve(global.utilsFolder, "response"));

module.exports = {
    create: function(req, res) {
        eventService.createEvent(req.session._doc, req.run._doc, req.body).then(function(data) {
            responseUtil.sendSuccessResponse("Event created successfully", 201, data, res);
        }).catch(function(error) {
            responseUtil.sendErrorResponse(error, "Could not create a new Event", null, res);
        });
    }
};
