const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const HOST = process.env.HOST ? process.env.HOST : "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const TITLE = process.env.TITLE ? process.env.TITLE : "Fintz Sensors";

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
    io.emit('sensor_event', sensorPayload);
    res.send(response);
});

io.on("connection", function(socket){
    console.log("new connection detected on socket ", socket.id);
    io.emit('ping_event', {"msg":"connection established"});
});

server.listen(PORT, HOST, function onStart(err) {
    err ? console.log(err) : console.info("Listening on port " + PORT);
});