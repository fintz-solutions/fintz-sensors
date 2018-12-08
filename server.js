const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const easytimer = require("easytimer.js");

const HOST = process.env.HOST ? process.env.HOST : "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const TITLE = process.env.TITLE ? process.env.TITLE : "Fintz Sensors";

app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.render(__dirname + "/index", { title: TITLE });
});

app.get('/scripts/easytimer.js', function(req, res) {
    res.sendFile(__dirname + '/easytimer.min.js');
});

app.post('/timer/event', function(req, res) {
    let sensorPayload= req.body;
    let response = {
        status: 200,
        message: "Timer Event: received payload",
        data: sensorPayload
    };

    if(sensorPayload.sensor > 0 && sensorPayload.sensor <= 7) {
        console.log("timer event - sensor: " + sensorPayload.sensor);
        io.emit('toggleTimer', sensorPayload);
    }

    res.send(response);
});

io.on("connection", function(socket){
    console.log("new connection detected on socket ", socket.id);
    io.emit('ping_event', {"msg":"connection established"});
});

server.listen(PORT, HOST, function onStart(err) {
    err ? console.log(err) : console.info("Listening on port " + PORT);
});