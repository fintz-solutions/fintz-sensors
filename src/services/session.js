const path = require("path");
const modelsFolder = global.modelsFolder;
const sessionModel = require(path.resolve(modelsFolder, "session")).Session;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

module.exports.createSession = async function(sessionData) {
    let result = requestValidation.isValidBody(["name", "numStations", "numRuns",
        "timePerRun", "productionTarget"
    ], sessionData);

    if (result.status === true) {
        return sessionModel.createNew(sessionData);
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};

module.exports.getSession = async function(sessionNumber) {
    return sessionModel.findBySessionNumber(sessionNumber).then(function(session) {
        if (!session) {
            errorUtil.createAndThrowGenericError(`Could not find the session specified by number: ${sessionNumber}`,
                404);
        } else {
            //TODO: timestamp to date
            //TODO: clean session fields
            return session.findAllRunsForSession(true).then(function (runs) {
                session._doc.runs = runs;
                return session;
            });
        }
    });
};

module.exports.deleteSession = async function(sessionNumber) {
    return sessionModel.deleteSessionByNumber(sessionNumber);
};

module.exports.getSessions = async function() {
    return sessionModel.find({}); //TODO NELSON maybe change to get active sessions and filter by ones with an active status???
};
