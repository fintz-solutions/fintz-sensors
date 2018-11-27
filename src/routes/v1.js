module.exports = function (app, io) {

    app.get("v1/", function (req, res) {
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
};