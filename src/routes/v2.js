module.exports = function (app, io) {
    app.get("/v2/", function (req, res) {
        let response = {
            status: 200,
            message: "This is the v2 landing page!"
        };
        res.send(response);
    });
}