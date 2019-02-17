let mongoose = require('mongoose');
let Schema = mongoose.Schema;
const path = require("path");
const modelsFolder = global.modelsFolder;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));

let Session = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: {//autoincrement -> done
        type: Number,
        unique: true
    },
    createdAt: {//TIMESTAMP
        type: Number,
        required: true
    },
    numStations: {
        type: Number,
        required: true,
        min: 1,
        max: 8
    },
    numRuns: {
        type: Number,
        required: true,
        min: 1,
        max: 10
    },
    timePerRun: {//minutes??
        type: Number,
        required: true
    },
    productionTarget: {//target number of karts per run, target number of iterations(1 iteration completed -> 1 kart completed)
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['CREATED', 'RUNNING', 'FINISHED'],
        default: 'CREATED'
    }
});

// -------- Static methods -------- //

Session.statics.createNew = function(sessionData) {
    sessionData.createdAt = dateUtil.getCurrentTimestamp();
    return this.create(sessionData).then(function(newSession) {
        let runsData = [];
        for (let runNumber = 1; runNumber <= newSession._doc.numRuns; runNumber++) {
            let runData = {
                number: runNumber,
                totalTime: newSession._doc.timePerRun,
                status: runNumber === 1 ? "RUNNING" : "CREATED",
                session: newSession._doc._id
            };
            runsData.push(runData);
        }
        return runModel.insertMany(runsData).then(function (results) {
            return newSession._doc;
        });
    });
};

Session.statics.findBySessionId = function(sessionId) {
    return this.findById(sessionId).then(function(session) {
        return session && session._doc ? session._doc : null;
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Session", 404);
    });
};

Session.statics.findBySessionNumber = function(sessionNumber) {
    return this.findOne({number: sessionNumber}).then(function(session) {
        return session;
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Session", 404);
    });
};


Session.statics.findRunningSession = function() {
    return this.findOne({status: 'RUNNING'}).sort({ _id: -1 }).then(function(session) {
        return session;
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Could not find a running session", 500);
    });
};

Session.statics.deleteSessionById = function(sessionId) {
    return this.findById(sessionId).then(function(session) {
        if (session && session._doc) {
            return session.remove().then(function(deletedSession) {
                if (deletedSession && deletedSession._doc) {
                    return deletedSession.deleteAssociatedRunsForSession();
                } else {
                    return null;
                }
            });
        } else {
            errorUtil.createAndThrowGenericError("Invalid Session", 404);
        }
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Session", 404);
    });
};

Session.statics.deleteSessionByNumber = function(sessionNumber) {
    return this.findBySessionNumber(sessionNumber).then(function(session) {
        if (session && session._doc) {
            return session.remove().then(function(deletedSession) {
                if (deletedSession && deletedSession._doc) {
                    return deletedSession.deleteAssociatedRunsForSession();
                } else {
                    return null;
                }
            });
        } else {
            errorUtil.createAndThrowGenericError("Invalid Session", 404);
        }
    }).catch(function(error) {
        console.error(error);
        errorUtil.createAndThrowGenericError("Invalid Session", 404);
    });
};


// -------- Instance methods -------- //
Session.methods.findRunByNumberForSession = function(runNumber) {
    let sessionObj = this;
    return runModel.findOne({session: sessionObj._id, number: runNumber}).sort({ _id: -1 }).then(function (run) {
        return run;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not find a run with number ${runNumber} for session with number ${sessionObj.number}`, 404);
    });
};

Session.methods.findActiveRunForSession = function() {
    let sessionObj = this;
    return runModel.findOne({session: sessionObj._id, status: "RUNNING"}).sort({ _id: -1 }).then(function (activeRun) {
        return activeRun;
    }).catch(function (error) {
        console.error(error);
        errorUtil.createAndThrowGenericError(`Could not find an active run for session with number ${sessionObj.number}`, 404);
    });
};

Session.methods.findAllRunsForSession = function(fetchIterations) {
    let sessionObj = this;
    return runModel.findAllBySessionId(sessionObj._id, fetchIterations);
};

Session.methods.deleteAssociatedRunsForSession = function() {
    let deletedSession = this;
    return deletedSession.findAllRunsForSession().then(function(runsToDelete) {
        let promises = [];
        runsToDelete.forEach(function(runToDelete, index) {
            promises.push(runModel.deleteRunById(runToDelete.id));
        });
        return Promise.all(promises).then(function(results) {
            deletedSession._doc.status = "DELETED";
            return deletedSession._doc;
        });
    });
};

Session.pre("save", function(next) {
    let documentToBeSaved = this;
    sessionModel.findOne().sort({ _id: -1 }).then(function (lastCreatedSession) {
        let number = lastCreatedSession ? lastCreatedSession.number + 1 : 1;
        documentToBeSaved.number = number;
        next();
    }).catch(function (error) {
        next(error);
    });
});

const sessionModel = mongoose.model("Session", Session);
module.exports.Session = sessionModel;
