const path = require("path");
const modelsFolder = global.modelsFolder;
const runModel = require(path.resolve(modelsFolder, "run")).Run;
const requestValidation = require(path.resolve(global.utilsFolder, "requestValidation"));
const errorUtil = require(path.resolve(global.utilsFolder, "error"));

const acceptedActionsTypes = {
    START: "START",
    MOVE_KART: "MOVE_KART",
    CONTINUE_WORKING: "CONTINUE_WORKING",
    KILL: "KILL"
};


const parseAction = async function (project, run, actionType) {
    //TODO NELSON I might need to receive iteration as param here (latest iteration related to the run(if it is null it can only fit in the start action)??? -> i think it works for all cases here)
    //TODO NELSON I might also need the measurements associated to the current iteration
    switch (actionType) {
        case acceptedActionsTypes.START:
            //TODO NELSON the run needs do have the status as "CREATED" before this
            //TODO NELSON SHOULD not have an iteration at this moment
            //TODO NELSON socket events should be blocked for this project before this(I think we can see this if it does not exist an iteration at the moment(with a start time only))
            //TODO NELSON create a new iteration(with a start time)
            //TODO NELSON run total time starts decreasing(add start time to the run)
            //TODO NELSON set status of the run to running, set status of the project to running
            //TODO NELSON unlock socket events for the project
            break;
        case acceptedActionsTypes.MOVE_KART:
            //TODO NELSON can only happen when all stations have completed(current iteration has start but no stop time)
            //TODO NELSON also all measurements for that iteration must have a start and stop time(meaning all stations have stopped work for that iteration)
            //TODO then mark iteration as done(add a stop time)
            //TODO NELSON block socket events for project(meaning it does not exist an iteration with a start time only)
            break;
        case acceptedActionsTypes.CONTINUE_WORKING:
            //TODO NELSON this action can only be executed after move kart is clicked(meaning when it does not exist an iteration with a start time only related to that run)
            //TODO NELSON unlocks socket events for project
            //TODO NELSON create a new iteration for the run in the DB(add only a start time to it)
            break;
        case acceptedActionsTypes.KILL:
            //TODO NELSON -> destroy the project and info associated to it(runs, iterations, measurements and events)
            //TODO NELSON -> maybe mark the project with a status of messy and redirect to the project page(then the user can delete the project there)
            break;
        default:
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

module.exports.update = async function (project, run, actionData) {
    let result = requestValidation.isValidBody(["actionType"], actionData);
    if (result.status === true) {
        let {actionType} = actionData;
        if (acceptedActionsTypes.hasOwnProperty(actionData)) {
            //TODO NELSON validate here the accepted action types
            let result = parseAction(project, run, actionType);
        } else {
            errorUtil.createAndThrowGenericError("Invalid action type", 400);
        }
    } else {
        errorUtil.createAndThrowGenericError(result.message, 400);
    }
};
