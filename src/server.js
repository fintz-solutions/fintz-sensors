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
const mongoose = require('mongoose');
const projectRootFolder = path.resolve(__dirname);
global.projectRootFolder = projectRootFolder;
global.routesFolder = path.resolve(projectRootFolder + "/routes");
global.appTitle = TITLE;

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(bodyParser.json());
/*app.use(bodyParser.urlencoded({
    extended: true
}));
*/


const initMongoConnection = function(){
    try {
        mongoose.connect('mongodb://localhost:27017/fintz');
    }
    catch (error) {
        console.error("Could not connect to mongo", error)
        process.exit(1);
    }
};


//TODO NELSON set mongo db with mongoose
//TODO NELSON config file to set hostName port, user, pass etc
//TODO NELSON build models and schemas with mongoose

fs.readdir(routesFolder, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    //TODO NELSON para cada ficheiro na pasta route fazer o require e passar a app e o io
    files.forEach(function (file, index) {
        require(routesFolder + "/" + file)(app, io);
    });

    io.on("connection", function (socket) {
        console.log("new connection detected on socket ", socket.id);
        io.emit('ping_event', { "msg": "connection established" });
        socket.emit("identify");//TODO NELSON client(browser) should identify itself to the server
        socket.on("identified", function (data) {
            //TODO NELSON save the socket id or socket
            //TODO NELSON all events are now sent to this id
        });
    });

    initMongoConnection();
    server.listen(PORT, HOST, function onStart(err) {
        err ? console.log(err) : console.info("Listening on port " + PORT);
    });
});


/*
app.get("/", function(req, res) {
    res.render(__dirname + "/index", { title: TITLE });
});
*/

/*
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


/*
io.on("connection", function (socket) {
    console.log("new connection detected on socket ", socket.id);
    io.emit('ping_event', { "msg": "connection established" });
});

server.listen(PORT, HOST, function onStart(err) {
    err ? console.log(err) : console.info("Listening on port " + PORT);
    console.log("DEBUG");
});
*/