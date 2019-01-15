const path = require("path");
const modelsFolder = global.modelsFolder;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));

const acceptedActionsTypes = {
    //TODO NELSON the run needs do have the status as "RUNNING" before this
    //TODO NELSON SHOULD not have an iteration at this moment
    //TODO NELSON socket events should be blocked for this project before this(I think we can see this if it does not exist an iteration at the moment(with a start time only))
    //TODO NELSON create a new iteration(with a start time)
    //TODO NELSON run total time starts decreasing(add start time to the run)
    //TODO NELSON set status of the run to running, set status of the project to running
    //TODO NELSON unlock socket events for the project
    START: {
        key: "START",
        canExecute: function (project, run, iteration, measurements) {
            return ((project.status === "CREATED" || project.status === "RUNNING") &&
                run.status === "RUNNING" &&
                iteration === null &&
                Array.isArray(measurements) &&
                measurements.length === 0);
        }
    },
    //TODO NELSON can only happen when all stations have completed(current iteration has start but no stop time)
    //TODO NELSON also all measurements for that iteration must have a start and stop time(meaning all stations have stopped work for that iteration)
    //TODO then mark iteration as done(add a stop time)
    //TODO NELSON block socket events for project(meaning it does not exist an iteration with a start time only)
    MOVE_KART: {
        key: "MOVE_KART",
        canExecute: function (project, run, iteration, measurements) {
            let baseCheck = (project.status === "RUNNING" &&
                run.status === "RUNNING" &&
                iteration &&
                iteration.startTime &&
                !iteration.stopTime &&
                Array.isArray(measurements) &&
                measurements.length === project.numStations);
            if (baseCheck) {
                let result = true;
                measurements.forEach(function (measurement) {
                    //each measurement must have a startTime and stopTime to be able to move kart
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
    //TODO NELSON this action can only be executed after move kart is clicked(meaning when it does not exist an iteration with a start time only related to that run)
    //TODO NELSON unlocks socket events for project
    //TODO NELSON create a new iteration for the run in the DB(add only a start time to it)
    CONTINUE_WORKING: {
        key: "CONTINUE_WORKING",
        canExecute: function (project, run, iteration, measurements) {
            return (project.status === "RUNNING" &&
                run.status === "RUNNING" &&
                iteration &&
                !iteration.startTime &&
                !iteration.stopTime &&
                Array.isArray(measurements) &&
                measurements.length === 0);
        }
    },
    //TODO NELSON -> destroy the project and info associated to it(runs, iterations, measurements and events)
    //TODO NELSON -> maybe mark the project with a status of messy and redirect to the project page(then the user can delete the project there)
    KILL: {
        key: "KILL",
        canExecute: function (project, run, iteration, measurements) {
            return true;//TODO NELSON think about this, but I think a project can be killed without any check at the moment
        }
    },
    //TODO NELSON -> Frontend needs to call this action when the run total time reached zero
    END_RUN: {
        key: "END_RUN",
        canExecute: function (project, run, iteration, measurements) {
            return (project.status === "RUNNING" &&
                run.status === "RUNNING" &&
                run.startTimestamp &&
                run.startTimestamp + (run.totalTime * 60) <= dateUtil.getCurrentTimestamp());
        }
    }
};


const executeRunAction = async function (project, run, iteration, measurements, actionType) {
    switch (actionType) {
        case acceptedActionsTypes.START.key:
            if (acceptedActionsTypes.START.canExecute(project, run, iteration, measurements)) {
                //TODO NELSON implement transactions here
                let runStartTime = dateUtil.getCurrentTimestamp();
                let promises = [
                    project.updateOne({status: "RUNNING"}),
                    run.updateOne({startTimestamp: runStartTime})
                ];
                return Promise.all(promises).then(function (results) {
                    let previousIterationNumber = null;
                    let createWithAStartTime = true;
                    return run.createNewIterationForRun(previousIterationNumber, createWithAStartTime).then(function (createdIteration) {
                        project.status = "RUNNING";
                        run.startTimestamp = runStartTime;
                        return {
                            project: project,
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
        case acceptedActionsTypes.MOVE_KART.key:
            if (acceptedActionsTypes.MOVE_KART.canExecute(project, run, iteration, measurements)) {
                //TODO NELSON implement transactions here
                let iterationStopTime = dateUtil.getCurrentTimestamp();
                let promises = [
                    iteration.updateOne({stopTime: iterationStopTime})
                ];
                return Promise.all(promises).then(function (results) {
                    let previousIterationNumber = iteration.number;
                    let createWithAStartTime = false;
                    return run.createNewIterationForRun(previousIterationNumber, createWithAStartTime).then(function (createdIteration) {
                        return {
                            project: project,
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
                errorUtil.createAndThrowGenericError("Cannot move kart", 400);
            }
            break;
        case acceptedActionsTypes.CONTINUE_WORKING.key:
            if (acceptedActionsTypes.CONTINUE_WORKING.canExecute(project, run, iteration, measurements)) {
                let iterationStartTime = dateUtil.getCurrentTimestamp();
                return iteration.updateOne({startTime: iterationStartTime}).then(function (updatedIteration) {
                    iteration.startTime = iterationStartTime;
                    return {
                        project: project,
                        run: run,
                        iteration: iteration,
                        measurements: [],
                        actionType: actionType
                    };
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot continue working", 400);
            }
            break;
        case acceptedActionsTypes.KILL.key:
            if (acceptedActionsTypes.KILL.canExecute(project, run, iteration, measurements)) {
                return projectModel.deleteProjectByNumber(project.number).then(function (deletedProject) {
                    return {
                        project: deletedProject,
                        run: run,
                        iteration: iteration,
                        measurements: measurements,
                        actionType: actionType
                    };
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot Kill project", 400);
            }
            break;
        case acceptedActionsTypes.END_RUN.key:
            if (acceptedActionsTypes.END_RUN.canExecute(project, run, iteration, measurements)) {
                let promises = [
                    run.updateOne({status: "FINISHED"})
                ];
                if (run.number === project.numRuns) {
                    project.status = "FINISHED";
                    promises.push(project.updateOne({status: "FINISHED"}));
                } else {
                    //TODO NELSON mark the following run as running
                    promises.push(runModel.findOneAndUpdate({
                        project: project._id,
                        number: run.number + 1
                    }, {$set: {status: "RUNNING"}}));
                }
                return Promise.all(promises).then(function (results) {
                    run.status = "FINISHED";
                    return {
                        project: project,
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
            return null;
        //TODO NELSON think how to handle the default case(throw an error or simply return as null)
    }
};

module.exports.createRun = async function (runData) {
    let result = requestValidation.isValidBody(["number", "startTimestamp", "totalTime", "status", "project"
    ], runData);
    if (result.status === true) {
        return runModel.createNew(runData);
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};

module.exports.update = async function (project, run, iteration, measurements, actionData) {
    let result = requestValidation.isValidBody(["actionType"], actionData);
    if (result.status === true) {
        let {actionType} = actionData;
        if (acceptedActionsTypes.hasOwnProperty(actionType)) {
            //TODO NELSON validate here the accepted action types
            return executeRunAction(project, run, iteration, measurements, actionType);
        } else {
            errorUtil.createAndThrowGenericError("Invalid action type", 400);
        }
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};

module.exports.get = async function (project, run, iteration, measurements) {
    let result = {
        project: project,
        run: run,
        iteration: iteration,
        measurements: measurements
    };

    return new Promise(function (resolve, reject) {
        resolve(result);
    });
};