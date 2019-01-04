const path = require("path");
const modelsFolder = global.modelsFolder;
const eventModel = require(path.resolve(modelsFolder, "event")).Event;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports.createEvent = async function(project, run, eventData) {
    let result = requestValidation.isValidBody(["type", "subtype"], eventData);
    if (result.status === true) {
        return eventModel.createNew(eventData);
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};
