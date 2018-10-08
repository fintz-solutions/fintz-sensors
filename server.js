const ejs = require("ejs");
const express = require("express");
const bodyParser = require("body-parser");

const HOST = process.env.HOST ? process.env.HOST : "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const TITLE = process.env.TITLE ? process.env.TITLE : "Fintz Sensors";

const app = express();

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.render(__dirname + "/index", { title: TITLE });
});

app.post('/sensors/ping', function(req, res) {
    let sensorPayload= req.body;
    let response = {
        status: 200,
        message: "Pong: received payload",
        data: sensorPayload
    };
    res.send(response);
});

app.listen(PORT, HOST, function onStart(err) {
    err ? console.log(err) : console.info("Listening on port " + PORT);
});