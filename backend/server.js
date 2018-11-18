const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const HOST = process.env.HOST ? process.env.HOST : "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const TITLE = process.env.TITLE ? process.env.TITLE : "Fintz Sensors";

const fs = require("fs");
const path = require("path");
const projectRootFolder = path.resolve(__dirname + "/../");
global.projectRootFolder = projectRootFolder;
global.backendFolder = path.resolve(projectRootFolder + "/backend");
global.webAppFolder = path.resolve(projectRootFolder + "/webApp");

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(bodyParser.json());

const routesFolder = path.resolve(global.backendFolder + "/routes");

fs.readdir(routesFolder, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    //TODO NELSON para cada fiehurio na pasta route fazer o require e passar a app e o io
    files.forEach(function (file, index) {
        // Make one pass and make the file complete
        var fromPath = path.join(moveFrom, file);
        var toPath = path.join(moveTo, file);

        fs.stat(fromPath, function (error, stat) {
            if (error) {
                console.error("Error stating file.", error);
                return;
            }

            if (stat.isFile())
                console.log("'%s' is a file.", fromPath);
            else if (stat.isDirectory())
                console.log("'%s' is a directory.", fromPath);

            fs.rename(fromPath, toPath, function (error) {
                if (error) {
                    console.error("File moving error.", error);
                }
                else {
                    console.log("Moved file '%s' to '%s'.", fromPath, toPath);
                }
            });
        });
    });
});

//TODO NELSON


/*
app.get("/", function(req, res) {
    res.render(__dirname + "/index", { title: TITLE });
});

var timerActive = false;

app.post('/timer/event', function(req, res) {
    let sensorPayload= req.body;
    let response = {
        status: 200,
        message: "Pong: received payload",
        data: sensorPayload
    };

    if(timerActive == false)
    {
        io.emit('startTimer', sensorPayload);
        timerActive = true;
    }
    else
    {
        io.emit('stopTimer', sensorPayload);
        timerActive = false;
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

*/

io.on("connection", function (socket) {
    console.log("new connection detected on socket ", socket.id);
    io.emit('ping_event', { "msg": "connection established" });
});

server.listen(PORT, HOST, function onStart(err) {
    err ? console.log(err) : console.info("Listening on port " + PORT);
});