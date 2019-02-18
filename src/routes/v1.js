const path = require("path");
const controllersFolder = global.controllersFolder;
const middlewareFolder = global.middlewareFolder;
const sessionController = require(path.resolve(controllersFolder, "session"));
const runController = require(path.resolve(controllersFolder, "run"));
const eventController = require(path.resolve(controllersFolder, "event"));
const timerController = require(path.resolve(controllersFolder, "timer"));
const landingPageController = require(path.resolve(controllersFolder, "landingPage"));
const sessionMiddleware = require(path.resolve(middlewareFolder, "session"));
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
        sessionMiddleware.getActiveSession,
        runMiddleware.getActiveRun,
        iterationMiddleware.getActiveIteration,
        measurementMiddleware.getActiveMeasureForStationIteration,
        function(req, res){
            timerController.processTimerEvent(io, req, res);
        });

    /* EVENTS(SAFETY and QUALITY)  endpoints */
    app.post("/events", sessionMiddleware.getActiveSession, runMiddleware.getActiveRun, eventController.create);


    //------- Session endpoints --------
    //TODO NELSON request to GET new session HTML page
    //TODO NELSON request to move kart ???? -> generates new iteration
    //TODO NELSON request to get the graphs


    app.post("/sessions", sessionController.create);


    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/sessions", sessionController.list);

    app.delete("/sessions/:sessionNumber", sessionController.delete);

    app.get("/sessions/:sessionNumber/runs/:runNumber",
        sessionMiddleware.getSession,
        runMiddleware.getRun,
        iterationMiddleware.getLatestIteration,
        measurementMiddleware.getIterationMeasurements,
        runController.get);

    app.get("/sessions/:sessionNumber/runs/:runNumber/stats",
        sessionMiddleware.getSession,
        runMiddleware.getRun,
        iterationMiddleware.getAllIterations,
        measurementMiddleware.getMeasurementsForIterations,
        statsController.getRunStats);

    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/sessions/:sessionNumber", sessionController.get);

    app.get("/sessions/:sessionNumber/stats",
        sessionMiddleware.getCompleteSession,
        statsController.getSessionStats);

    //TODO NELSON NEW STUFF TO DO:
    //TODO NELSON -> new action routes for start, move kart, continue working, and kill session -> see mocks file
    app.post("/sessions/:sessionNumber/runs/:runNumber",
        sessionMiddleware.getSession,
        runMiddleware.getRun,
        iterationMiddleware.getLatestIteration,
        measurementMiddleware.getIterationMeasurements,
        runController.update);

    //TODO NELSON send run details on session details route
    //TODO NELSON redirect to session details template after a new session is created if request originated from HTML -> nope
};
