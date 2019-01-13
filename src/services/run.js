const path = require("path");
const modelsFolder = global.modelsFolder;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const projectModel = require(path.resolve(modelsFolder, "project")).Project;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));
const dateUtil = require(path.resolve(global.utilsFolder, "date"));

const acceptedActionsTypes = {
    START: "START",
    MOVE_KART: "MOVE_KART",
    CONTINUE_WORKING: "CONTINUE_WORKING",
    KILL: "KILL",
    END_RUN: "END_RUN"//TODO NELSON
};


const parseAction = async function (project, run, iteration, measurements, actionType) {
    //TODO NELSON I might need to receive iteration as param here (latest iteration related to the run(if it is null it can only fit in the start action)??? -> i think it works for all cases here)
    //TODO NELSON I might also need the measurements associated to the current iteration
    switch (actionType) {
        case acceptedActionsTypes.START:
            if (project.status === "CREATED" && run.status === "RUNNING" && iteration === null && Array.isArray(measurements) && measurements.length === 0) {
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
                        return  {
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
            //TODO NELSON the run needs do have the status as "RUNNING" before this
            //TODO NELSON SHOULD not have an iteration at this moment
            //TODO NELSON socket events should be blocked for this project before this(I think we can see this if it does not exist an iteration at the moment(with a start time only))
            //TODO NELSON create a new iteration(with a start time)
            //TODO NELSON run total time starts decreasing(add start time to the run)
            //TODO NELSON set status of the run to running, set status of the project to running
            //TODO NELSON unlock socket events for the project
            break;
            //return null;
        case acceptedActionsTypes.MOVE_KART:
            if (project.status === "RUNNING" && run.status === "RUNNING" && iteration && iteration.startTime && !iteration.stopTime && Array.isArray(measurements) && measurements.length === project.numStations /* && TODO NELSON cada measure tem de ter um start e stop time */) {
                //TODO NELSON implement transactions here
                let iterationStopTime = dateUtil.getCurrentTimestamp();
                let promises = [
                    iteration.updateOne({stopTime: iterationStopTime})
                ];
                return Promise.all(promises).then(function (results) {
                    let previousIterationNumber = iteration.number;
                    let createWithAStartTime = false;
                    return run.createNewIterationForRun(previousIterationNumber, createWithAStartTime).then(function (createdIteration) {
                        return  {
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
            //TODO NELSON can only happen when all stations have completed(current iteration has start but no stop time)
            //TODO NELSON also all measurements for that iteration must have a start and stop time(meaning all stations have stopped work for that iteration)
            //TODO then mark iteration as done(add a stop time)
            //TODO NELSON block socket events for project(meaning it does not exist an iteration with a start time only)
            //break;
            return null;
        case acceptedActionsTypes.CONTINUE_WORKING:
            if (project.status === "RUNNING" && run.status === "RUNNING" && iteration && !iteration.startTime && !iteration.stopTime && Array.isArray(measurements) && measurements.length === 0) {
                let iterationStartTime = dateUtil.getCurrentTimestamp();
                return iteration.updateOne({startTime: iterationStartTime}).then(function (updatedIteration) {
                    return {
                        project: project,
                        run: run,
                        iteration: updatedIteration,
                        measurements: [],
                        actionType: actionType
                    };
                });
            } else {
                errorUtil.createAndThrowGenericError("Cannot continue working", 400);
            }

            //TODO NELSON this action can only be executed after move kart is clicked(meaning when it does not exist an iteration with a start time only related to that run)
            //TODO NELSON unlocks socket events for project
            //TODO NELSON create a new iteration for the run in the DB(add only a start time to it)
            //break;
            return null;
        case acceptedActionsTypes.KILL:
            //TODO NELSON -> destroy the project and info associated to it(runs, iterations, measurements and events)
            //TODO NELSON -> maybe mark the project with a status of messy and redirect to the project page(then the user can delete the project there)
            return projectModel.deleteProjectByNumber(project.number).then(function (deletedProject) {
                return {
                    project: deletedProject,
                    run: run,
                    iteration: iteration,
                    measurements: measurements,
                    actionType: actionType
                };
            });
            //break;
        case acceptedActionsTypes.END_RUN:
            if (project.status === "RUNNING" && run.status === "RUNNING" && run.startTimestamp && run.startTimestamp + (run.totalTime * 60) <= dateUtil.getCurrentTimestamp()) {
                let promises = [
                    run.updateOne({status: "FINISHED"})
                ];
                if(run.number === project.numRuns) {
                    project.status = "FINISHED";
                    promises.push(project.updateOne({status: "FINISHED"}));
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
            //TODO NELSON -> Frontend needs to call this action when the run total time reached zero
            //break;
            return null;
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
            return parseAction(project, run, iteration, measurements, actionType);
        } else {
            errorUtil.createAndThrowGenericError("Invalid action type", 400);
        }
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};