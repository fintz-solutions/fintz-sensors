const path = require("path");
const controllersFolder = global.controllersFolder;
const middlewareFolder = global.middlewareFolder;
const projectController = require(path.resolve(controllersFolder, "project"));
const runController = require(path.resolve(controllersFolder, "run"));
const eventController = require(path.resolve(controllersFolder, "event"));
const timerController = require(path.resolve(controllersFolder, "timer"));
const landingPageController = require(path.resolve(controllersFolder, "landingPage"));
const projectMiddleware = require(path.resolve(middlewareFolder, "project"));
const runMiddleware = require(path.resolve(middlewareFolder, "run"));
const iterationMiddleware = require(path.resolve(middlewareFolder, "iteration"));
const measurementMiddleware = require(path.resolve(middlewareFolder, "measurement"));
const statsController = require(path.resolve(controllersFolder, "stats"));

module.exports = function (app, io) {
    // ----- Landing page endpoint ----
    app.get("/", landingPageController.show);

    // ----- Events endpoints -------

    /*
    //TODO NELSON let's think a better name for this route -> timer/measuremts
    app.post('/timer/event', function (req, res) {
        let sensorPayload = req.body;
        let sensorNumber = sensorPayload.sensor;
        let response = null;
        //TODO NELSON save sensorPayload to db then send start or stop timer

        if (sensorNumber > 0 && sensorNumber <= 8) {
            console.log("timer event - sensor: " + sensorNumber);
            io.emit('toggleTimer', sensorPayload);

            response = {
                message: "Timer Event: received sensor",
                data: sensorPayload
            };

            res.send(response);
        } else {
            console.error("ERROR - timer event - sensor: " + sensorNumber);

            response = {
                message: "Timer Event: invalid sensor",
                data: sensorPayload
            };

            res.status(400).send(response);
        }
    });
    */

    app.post('/timers',
        projectMiddleware.getActiveProject,
        runMiddleware.getActiveRun,
        iterationMiddleware.getActiveIteration,
        measurementMiddleware.getActiveMeasureForStationIteration,
        function(req, res){
            timerController.processTimerEvent(io, req, res);
        });

    /* EVENTS(SAFETY and QUALITY)  endpoints */
    app.post("/events", projectMiddleware.getActiveProject, runMiddleware.getActiveRun, eventController.create);


    //------- Project endpoints --------
    //TODO NELSON request to GET new project HTML page
    //TODO NELSON request to move kart ???? -> generates new iteration
    //TODO NELSON request to get the graphs


    app.post("/projects", projectController.create);


    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/projects", projectController.list);

    app.delete("/projects/:projectNumber", projectController.delete);

    /*
    app.get("/projects/:projectNumber/runs/:runNumber", function(req, res) {
        //TODO: just for testing purposes
        //TODO: needs validations and params names may change
        res.render("pages/run_show.html.tpl", {
            project_id: req.params["id"],
            run: req.params["run"],
        });
    });
    */

    app.get("/projects/:projectNumber/runs/:runNumber",
        projectMiddleware.getProject,
        runMiddleware.getRun,
        iterationMiddleware.getLatestIteration,
        measurementMiddleware.getIterationMeasurements,
        runController.get);

    app.get("/projects/:projectNumber/runs/:runNumber/stats",
        projectMiddleware.getProject,
        runMiddleware.getRun,
        iterationMiddleware.getAllIterations,
        measurementMiddleware.getMeasurementsForIterations,
        statsController.getRunStats);

    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/projects/:projectNumber", projectController.get);

    app.get("/projects/:projectNumber/stats",
        projectMiddleware.getCompleteProject,
        statsController.getProjectStats);

    //TODO NELSON NEW STUFF TO DO:
    //TODO NELSON -> new action routes for start, move kart, continue working, and kill project -> see mocks file
    app.post("/projects/:projectNumber/runs/:runNumber",
        projectMiddleware.getProject,
        runMiddleware.getRun,
        iterationMiddleware.getLatestIteration,
        measurementMiddleware.getIterationMeasurements,
        runController.update);

    //TODO NELSON send run details on project details route
    //TODO NELSON redirect to project details template after a new project is created if request originated from HTML -> nope
};
