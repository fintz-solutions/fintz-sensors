const path = require("path");
const modelsFolder = global.modelsFolder;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const sessionModel = require(path.resolve(modelsFolder, "session")).Session;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));

const acceptedActionsTypes = {
    //TODO NELSON the run needs do have the status as "RUNNING" before this
    //TODO NELSON SHOULD not have an iteration at this moment
    //TODO NELSON socket events should be blocked for this session before this(I think we can see this if it does not exist an iteration at the moment(with a start time only))
    //TODO NELSON create a new iteration(with a start time)
    //TODO NELSON run total time starts decreasing(add start time to the run)
    //TODO NELSON set status of the run to running, set status of the session to running
    //TODO NELSON unlock socket events for the session
    START: {
        key: "START",
        canExecute: function (session, run, iteration, measurements) {
            return ((session.status === "CREATED" || session.status === "RUNNING") &&
                run.status === "RUNNING" &&
                iteration === null &&
                Array.isArray(measurements) &&
                measurements.length === 0);
        }
    },
    //TODO NELSON can only happen when all stations have completed(current iteration has start but no stop time)
    //TODO NELSON also all measurements for that iteration must have a start and stop time(meaning all stations have stopped work for that iteration)
    //TODO then mark iteration as done(add a stop time)
    //TODO NELSON block socket events for session(meaning it does not exist an iteration with a start time only)
    MOVE_ITER: {
        key: "MOVE_ITER",
        canExecute: function (session, run, iteration, measurements) {
            let baseCheck = (session.status === "RUNNING" &&
                run.status === "RUNNING" &&
                iteration &&
                iteration.startTime &&
                !iteration.stopTime &&
                Array.isArray(measurements) &&
                measurements.length === session.numStations);
            if (baseCheck) {
                let result = true;
                measurements.forEach(function (measurement) {
                    //each measurement must have a startTime and stopTime to be able to move iteration
                    if (!measurement.startTime || !measurement.stopTime) {
                        result = false;
                        return;
                    }
                });
                return result;
            } else {
                return false;
            }
        }
    },
    //TODO NELSON this action can only be executed after move iteration is clicked(meaning when it does not exist an iteration with a start time only related to that run)
    //TODO NELSON unlocks socket events for session
    //TODO NELSON create a new iteration for the run in the DB(add only a start time to it)
    CONTINUE: {
        key: "CONTINUE",
        canExecute: function (session, run, iteration, measurements) {
            let baseCheck = (session.status === "RUNNING" &&
                run.status === "RUNNING" &&
                iteration &&
                !iteration.startTime &&
                !iteration.stopTime &&
                Array.isArray(measurements) &&
                measurements.length === session.numStations);

            if(baseCheck) {
                let result = measurements.every(function (measurement) {
                    return !measurement.startTime && !measurement.stopTime
                });
                return result;
            } else {
                return false;
            }
        }
    },
    //TODO NELSON -> destroy the session and info associated to it(runs, iterations, measurements and events)
    //TODO NELSON -> maybe mark the session with a status of messy and redirect to the session page(then the user can delete the session there)
    KILL: {
        key: "KILL",
        canExecute: function (session, run, iteration, measurements) {
            return true;//TODO NELSON think about this, but I think a session can be killed without any check at the moment
        }
    },
    //TODO NELSON -> Frontend needs to call this action when the run total time reached zero
    END: {
        key: "END",
        canExecute: function (session, run, iteration, measurements) {
            return (session.status === "RUNNING" &&
                run.status === "RUNNING" &&
                run.startTimestamp &&
                run.startTimestamp + (run.totalTime * 60) <= dateUtil.getCurrentTimestamp());
        }
    }
};


const executeRunAction = async function (session, run, iteration, measurements, actionType) {
    switch (actionType) {
        case acceptedActionsTypes.START.key:
            if (acceptedActionsTypes.START.canExecute(session, run, iteration, measurements)) {
                //TODO NELSON implement transactions here
                let runStartTime = dateUtil.getCurrentTimestamp();
                let promises = [
                    session.updateOne({status: "RUNNING"}),
                    run.updateOne({startTimestamp: runStartTime})
                ];
                return Promise.all(promises).then(function (results) {
                    let previousIterationNumber = null;
                    let createWithAStartTime = true;
                    return run.createNewIterationForRun(previousIterationNumber, createWithAStartTime, session.numStations).then(function (createdIteration) {
                        session.status = "RUNNING";
                        run.startTimestamp = runStartTime;
                        return {
                            session: session,
                            run: run,
                            iteration: createdIteration,
                            measurements: measurements,
                            actionType: actionType
                        };
                    });
                }).catch(function (error) {
                    throw error;
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot start a new run", 400);
            }
            break;
        case acceptedActionsTypes.MOVE_ITER.key:
            if (acceptedActionsTypes.MOVE_ITER.canExecute(session, run, iteration, measurements)) {
                //TODO NELSON implement transactions here
                let iterationStopTime = dateUtil.getCurrentTimestamp();
                let promises = [
                    iteration.updateOne({stopTime: iterationStopTime})
                ];
                return Promise.all(promises).then(function (results) {
                    let previousIterationNumber = iteration.number;
                    let createWithAStartTime = false;
                    return run.createNewIterationForRun(previousIterationNumber, createWithAStartTime, session.numStations).then(function (createdIteration) {
                        return {
                            session: session,
                            run: run,
                            iteration: createdIteration,
                            measurements: [],//TODO here it must be like this because we created a new iteration without measurements
                            actionType: actionType
                        };
                    });
                }).catch(function (error) {
                    throw error;
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot move iteration", 400);
            }
            break;
        case acceptedActionsTypes.CONTINUE.key:
            if (acceptedActionsTypes.CONTINUE.canExecute(session, run, iteration, measurements)) {
                let iterationStartTime = dateUtil.getCurrentTimestamp();
                return iteration.updateOne({startTime: iterationStartTime}).then(function (updatedIteration) {
                    iteration.startTime = iterationStartTime;
                    return {
                        session: session,
                        run: run,
                        iteration: iteration,
                        measurements: [],
                        actionType: actionType
                    };
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot continue", 400);
            }
            break;
        case acceptedActionsTypes.KILL.key:
            if (acceptedActionsTypes.KILL.canExecute(session, run, iteration, measurements)) {
                return sessionModel.deleteSessionByNumber(session.number).then(function (deletedSession) {
                    return {
                        session: deletedSession,
                        run: run,
                        iteration: iteration,
                        measurements: measurements,
                        actionType: actionType
                    };
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot Kill Session", 400);
            }
            break;
        case acceptedActionsTypes.END.key:
            if (acceptedActionsTypes.END.canExecute(session, run, iteration, measurements)) {
                let promises = [
                    run.updateOne({status: "FINISHED"})
                ];
                if (run.number === session.numRuns) {
                    session.status = "FINISHED";
                    promises.push(session.updateOne({status: "FINISHED"}));
                } else {
                    //TODO NELSON mark the following run as running
                    promises.push(runModel.findOneAndUpdate({
                        session: session._id,
                        number: run.number + 1
                    }, {$set: {status: "RUNNING"}}));
                }
                return Promise.all(promises).then(function (results) {
                    run.status = "FINISHED";
                    return {
                        session: session,
                        run: run,
                        iteration: iteration,
                        measurements: measurements,
                        actionType: actionType
                    };
                }).catch(function (error) {
                    throw error;
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot End run yet", 400);
            }
            break;
        default:
            errorUtil.createAndThrowGenericError(`Invalid action: ${actionType}`, 400);
    }
};

module.exports.createRun = async function (runData) {
    let result = requestValidation.isValidBody(["number", "startTimestamp", "totalTime", "status", "session"
    ], runData);
    if (result.status === true) {
        return runModel.createNew(runData);
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};

module.exports.update = async function (session, run, iteration, measurements, actionData) {
    let result = requestValidation.isValidBody(["actionType"], actionData);
    if (result.status === true) {
        let {actionType} = actionData;
        if (acceptedActionsTypes.hasOwnProperty(actionType)) {
            //TODO NELSON validate here the accepted action types
            return executeRunAction(session, run, iteration, measurements, actionType);
        } else {
            errorUtil.createAndThrowGenericError("Invalid action type", 400);
        }
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};

module.exports.get = async function (session, run, iteration, measurements) {
    let result = {
        session: session,
        run: run,
        iteration: iteration,
        measurements: measurements
    };

    return new Promise(function (resolve, reject) {
        resolve(result);
    });
};
