
function SocketTransport(callback) {
    this.ws = null;
    this.callback = callback;
}

SocketTransport.prototype.init = function () {
    this.ws = new WebSocket('ws://localhost:3000/ws');
    this.ws.onmessage = event => {
        this.callback(event.data);
    };
};

window.addEventListener('load', function () {
    const svgContainer = document.getElementById('SVGContainer');
    const canvasContainer = document.getElementById('canvasContainer');
    const canvasChart = new CanvasChart(canvasContainer, 300);
    const svgChart = new SVGChart(svgContainer, 300);

    new SocketTransport(function (data) {
        svgChart.draw(data);
        canvasChart.draw(data);
    }).init();
});

