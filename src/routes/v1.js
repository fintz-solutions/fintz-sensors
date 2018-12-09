const path = require("path");
const controllersFolder = global.controllersFolder;
const projectController = require(path.resolve(controllersFolder, "project"));
const runController = require(path.resolve(controllersFolder, "run"));

module.exports = function (app, io) {

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

    // ----- Index html endpoint ----
    app.get("/", function (req, res) {
        res.render(path.resolve(global.projectRootFolder, "index"), {title: global.appTitle});
    });



    // ----- Events endpoints -------
    var timerActive = false;
    app.post("/event/timer", function(req, res) {
        let sensorPayload= req.body;
        let response = {
            status: 200,
            message: "Pong: received payload",
            data: sensorPayload
        };

        //TODO NELSON sensorPayload must have stationID so that we can send the event to the correct station
        //TODO NELSON save sensorPayload to db then send start or stop timer
        //TODO NELSON the client should now for a specific station if it is to stop or start the timer
        //TODO NELSON this timerActive var should disappear
        //TODO NELSON this route should emit a specific event (changeTimerStatus) as the frontEnd should now if it is to be active or stopped(for a specific station)
        if(timerActive === false) {
            io.emit('startTimer', sensorPayload);
            timerActive = true;
        } else {
            io.emit('stopTimer', sensorPayload);
            timerActive = false;
        }

        res.send(response);
    });

    app.post("/event/security", function (req, res) {
        //req.body.type
    });

    app.post("/event/quality", function (req, res) {
        //req.body.type
    });


    //------- Project endpoints --------
    //TODO NELSON request to GET new project HTML page
    //TODO NELSON request to move kart ???? -> generates new iteration
    //TODO NELSON request to get the graphs




    //TODO NELSON should generate projet runs depending of the field runNumbers present in the request body
    //TODO NELSON build util to send responses(passing status code, message, data)
    app.post("/project", projectController.create);


    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/projects", projectController.list);

    //TODO NELSON request to GET in HTML or JSON depending on the request header
    app.get("/project/:id", projectController.get);

    app.delete("/project/:id", projectController.delete);

    
    //Run routes -> TODO NELSON -> I don't think this endpoint will be needed
    app.post("/run", runController.create);
};