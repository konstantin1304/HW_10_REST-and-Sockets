
//REST API
function RestApi(app, controller, model) {
    app.get('/api/history', (req, res) => {
        res.send(JSON.stringify(model.getData()));
    });

    app.get('/api/current', (req, res) => {
        res.send(JSON.stringify(controller.getCurrent()));
    });
}

module.exports = RestApi;