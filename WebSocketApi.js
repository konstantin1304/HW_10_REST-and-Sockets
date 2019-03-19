
//WebSocket API
function WEbSocketApi(app, controller, model) {
    const enableWs = require('express-ws');
    const expressWs = enableWs(app);
    const clients = [];

    expressWs.getWss().on('connection', ws => {
        clients.push(ws);
        let data = model.getData();
        if (!data.length) {
            return;
        }
        ws.send(JSON.stringify(data));
    });

    app.ws('/ws', ws => {
        ws.on('close', () => {
            const index = clients.indexOf(ws);
            if (index > -1) {
                clients.splice(index, 1);
            }
        })
    });

    const sendAllClients = message => {
        clients.forEach(client => client.send(message));
    };

    controller.subscribe(current => {
        sendAllClients(JSON.stringify(current));
    });
}

module.exports = WEbSocketApi;