const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = require("express")();
const server = require("http").Server(app);

const HOST = process.env.HOST ? process.env.HOST : "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;
const TITLE = process.env.TITLE ? process.env.TITLE : "Fintz Sensors";

app.engine("html", ejs.renderFile);
app.set("view engine", "html");
app.use(bodyParser.json());

app.get("/", function(req, res) {
    res.render(__dirname + "/index", { title: TITLE });
});

server.listen(PORT, HOST, function onStart(err) {
    err ? console.log(err) : console.info("Listening on port " + PORT);
});