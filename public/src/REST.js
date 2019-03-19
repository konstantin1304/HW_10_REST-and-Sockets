
function RestTransport(callback) {
    this.historyValuesPath = "http://localhost:3000/api/history";
    this.currentValuePath = "http://localhost:3000/api/current";
    this.callback = callback;
}

RestTransport.prototype.init = function () {
    this.getCurrentValues(this.historyValuesPath);

    setInterval(() => {
        this.getCurrentValues(this.currentValuePath)
    }, 1000);
};

RestTransport.prototype.getCurrentValues = function (path) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", path, true);

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            this.callback(xhr.responseText);
        }
    };

    xhr.send();
};

window.addEventListener('load', function () {
    const cont = document.getElementById('SVGContainer');
    const svgChart = new SVGChart(cont, 100, '#FF5316');
    const canvasChart = new CanvasChart(cont, 100);

    new RestTransport(function (data) {
        svgChart.draw(data);
        canvasChart.draw(data);
    }).init();
});
