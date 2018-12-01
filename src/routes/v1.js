const path = require("path");
const controllersFolder = path.resolve(global.projectRootFolder + "/controllers");
const projectController = require(controllersFolder + "/Project");
const runController = require(controllersFolder + "/Run");

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
        res.render(global.projectRootFolder + "/index", {title: global.appTitle});
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
    app.post("/project", function (req, res) {
        projectController.create(req, res).then(function (data) {
            res.status(201).send(data);
        }).catch(function (error) {
            let errorMessage = error && error.message ? error.message : "Could not create a new Project";
            let statusCode = error && error.statusCode ? error.statusCode : 500;
            console.error(errorMessage, error);
            res.status(statusCode).send({message: errorMessage});
        });
    });

    app.get("/project", function (req, res) {
        projectController.list(req, res).then(function (data) {
            res.status(200).send(data);
        }).catch(function (error) {
            let errorMessage = error && error.message ? error.message : "Could not retrieve Projects";
            let statusCode = error && error.statusCode ? error.statusCode : 500;
            console.error(errorMessage, error);
            res.status(statusCode).send({message: errorMessage});
        });
    });

    app.get("/project/:id", function (req, res) {
        projectController.get(req, res).then(function (data) {
            res.status(200).send(data);
        }).catch(function (error) {
            let errorMessage = error && error.message ? error.message : "Could not retrieve Project information";
            let statusCode = error && error.statusCode ? error.statusCode : 500;
            console.error(errorMessage, error);
            res.status(statusCode).send({message: errorMessage});
        });
    });

    app.delete("/project/:id", function (req, res) {
        projectController.delete(req, res).then(function (data) {
            res.status(200).send(data);
        }).catch(function (error) {
            let errorMessage = error && error.message ? error.message : "Could not delete Project";
            let statusCode = error && error.statusCode ? error.statusCode : 500;
            console.error(errorMessage, error);
            res.status(statusCode).send({message: errorMessage});
        });
    });


    //Run routes
    app.post("/run", function (req, res) {
        runController.create(req, res).then(function (data) {
            res.status(201).send(data);
        }).catch(function (error) {
            let errorMessage = error && error.message ? error.message : "Could not create a new Run";
            let statusCode = error && error.statusCode ? error.statusCode : 500;
            console.error(errorMessage, error);
            res.status(statusCode).send({message: errorMessage});
        });
    });
};