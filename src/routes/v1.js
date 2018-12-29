const path = require("path");
const controllersFolder = global.controllersFolder;
const projectController = require(path.resolve(controllersFolder, "project"));
const runController = require(path.resolve(controllersFolder, "run"));
const eventController = require(path.resolve(controllersFolder, "event"));
const landingPageController = require(path.resolve(controllersFolder, "landingPage"));

module.exports = function(app, io) {

    /*
    app.get(/"v1/", function (req, res) {
        res.render(__dirname + "/index", { title: TITLE });
    });

    app.post('v1/timer/event', function (req, res) {
        let sensorPayload = req.body;
        let response = {
            status: 200,
            message: "Pong: received payload",
            data: sensorPayload
        };

        if (timerActive == false) {
            io.emit('startTimer', sensorPayload);
            timerActive = true;
        }
        else {
            io.emit('stopTimer', sensorPayload);
            timerActive = false;
        }

        res.send(response);
    });
    */

    // ----- Landing page endpoint ----

    /*
    app.get("/", function(req, res) {
        res.render("landing.html.tpl", {
            title: global.appTitle,
            projects: []
        });
    });
    */
    app.get("/", landingPageController.show);

    // ----- Events endpoints -------
    //TODO NELSON let's think a better name for this route
    app.post('/timer/event', function(req, res) {
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

    /* EVENTS(SECURITY and QUALITY)  endpoints */
    app.post("/event", eventController.create);


    //------- Project endpoints --------
    //TODO NELSON request to GET new project HTML page
    //TODO NELSON request to move kart ???? -> generates new iteration
    //TODO NELSON request to get the graphs



    app.post("/project", projectController.create);


    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/projects", projectController.list);

    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/project/:id", projectController.get);

    app.delete("/project/:id", projectController.delete);

    app.get("/projects/:id/runs/:run", function(req, res) {
        //TODO: just for testing purposes
        //TODO: needs validations and params names may change
        res.render("pages/run.html.tpl", {
            project_id: req.params["id"],
            run: req.params["run"],
        });
    });
};
