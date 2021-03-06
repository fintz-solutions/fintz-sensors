const nunjucks = require("nunjucks");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
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
global.routesFolder = path.resolve(projectRootFolder, "routes");
global.controllersFolder = path.resolve(global.projectRootFolder, "controllers");
global.middlewareFolder = path.resolve(global.projectRootFolder, "middleware");
global.modelsFolder = path.resolve(global.projectRootFolder, "models");
global.servicesFolder = path.resolve(global.projectRootFolder, "services");
global.utilsFolder = path.resolve(global.projectRootFolder, "utils");
global.viewsFolder = path.resolve(global.projectRootFolder, "views");
global.staticFolder = path.resolve(global.projectRootFolder, "static");
global.appTitle = TITLE;

app.use(express.static(staticFolder));
app.set('views', global.viewsFolder);

nunjucks.configure(global.viewsFolder, {
    autoescape: true,
    express: app,
    watch: true
});

app.use(bodyParser.json());

const initMongoConnection = function() {
    try {
        const config = require(path.resolve(global.projectRootFolder, "config", "config"));
        const mongoConfig = config.mongo;
        const dbName = process.env.DB_NAME || mongoConfig.DB_NAME;
        const dbHost = process.env.DB_HOST || mongoConfig.DB_HOST;
        const dbPort = process.env.DB_PORT || mongoConfig.DB_PORT;
        const dbUser = process.env.DB_USER || mongoConfig.DB_USER;
        const dbPassword = process.env.DB_PASSWORD || mongoConfig.DB_PASSWORD;
        const userRole = process.env.DB_USER_ROLE || mongoConfig.DB_USER_ROLE;

        //TODO NELSON will have to see how to lock the database connection to a certain user
        /*
        const uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
        const authOptions = {
            user: dbUser,
            pass: dbPassword,
            auth: { authSource: userRole },
            useNewUrlParser: true
        };
        */
        const uri = `mongodb://${dbHost}:${dbPort}/${dbName}`;
        const authOptions = {
            useNewUrlParser: true
        };
        mongoose.set('useCreateIndex', true);
        return mongoose.connect(uri, authOptions).then(function(data) {
            console.log("MONGO CONNECTED");
            return null;
        }).catch(function(error) {
            console.error("ERROR: COULD NOT CONNECT TO MONGO: ", error);
            process.exit(1);
        });
    } catch (error) {
        console.error("ERROR: COULD NOT CONNECT TO MONGO: ", error);
        process.exit(1);
    }
};


fs.readdir(routesFolder, function(err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }

    files.forEach(function(file, index) {
        require(path.resolve(global.routesFolder, file))(app, io);
    });

    io.on("connection", function(socket) {
        console.log("new connection detected on socket ", socket.id);
        io.emit('ping_event', {
            "msg": "connection established"
        });
        socket.emit("identify"); //TODO NELSON client(browser) should identify itself to the server
        socket.on("identified", function(data) {
            //TODO NELSON save the socket id or socket
            //TODO NELSON all events are now sent to this id
        });
    });

    let promises = [];
    promises.push(initMongoConnection());
    Promise.all(promises).then(function(results) {
        server.listen(PORT, HOST, function onStart(err) {
            err ? console.log(err) : console.info("Listening on port " + PORT);
        });
    });
});
