const path = require("path");
const controllersFolder = global.controllersFolder;
const projectController = require(path.resolve(controllersFolder, "project"));
const runController = require(path.resolve(controllersFolder, "run"));
const eventController = require(path.resolve(controllersFolder, "event"));
const landingPageController = require(path.resolve(controllersFolder, "landingPage"));

module.exports = function(app, io) {
    // ----- Landing page endpoint ----
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
    app.post("/events", eventController.create);


    //------- Project endpoints --------
    //TODO NELSON request to GET new project HTML page
    //TODO NELSON request to move kart ???? -> generates new iteration
    //TODO NELSON request to get the graphs



    app.post("/projects", projectController.create);


    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/projects", projectController.list);

    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/projects/:id", projectController.get);

    app.delete("/projects/:id", projectController.delete);

    app.get("/projects/:id/runs/:run", function(req, res) {
        //TODO: just for testing purposes
        //TODO: needs validations and params names may change
        res.render("pages/run.html.tpl", {
            project_id: req.params["id"],
            run: req.params["run"],
        });
    });
};
