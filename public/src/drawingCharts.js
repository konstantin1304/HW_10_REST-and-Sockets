
function makeSVG(tag, attrs) {
    let el = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let k in attrs) {
        el.setAttribute(k, attrs[k]);
    }
    return el;
}

function SVGChart(container, height, color) {
    this.counter = 0;
    this.height = 100;
    this.color = '#09f';
    let attr = {};

    if (typeof height !== 'undefined') {
        this.height = height;
    }
    if (typeof color !== 'undefined') {
        this.color = color;
    }

    attr.height = this.height;
    this.svg = makeSVG('svg', attr);
    container.appendChild(this.svg);
    this.chartLine = makeSVG('polyline', {
        id: 'chartLine',
        points: '',
        style: 'fill:none;stroke:' + this.color + ';stroke-width:1;'
    });
    this.svg.appendChild(this.chartLine);
}

SVGChart.prototype.draw = function (data) {
    let datum = JSON.parse(data);
    let multiplier = 1;

    if (this.height !== null) {
        multiplier = this.height / 100;
    }

    if (Array.isArray(datum)) {
        let points = '';
        for (let i = 0; i < datum.length; i++) {
            points += `${this.counter},${datum[i].value * multiplier} `;
            this.counter++;
        }
        this.chartLine.setAttribute('points', `${points} `);
    } else {
        let points = this.chartLine.getAttribute('points');
        //console.log(points)
        this.chartLine.setAttribute('points', points += `${this.counter},${datum.value * multiplier} `);
    }

    this.counter++;
};

function makeCanvas(tag, attrs) {
    let canvas = document.createElement(tag);
    for (let k in attrs) {
        canvas.setAttribute(k, attrs[k]);
    }
    return canvas;
}

function CanvasChart(container, height, width, color) {
    this.counter = 0;
    this.height = 100;
    this.color = '#09f';
    this.width = null;
    let attr = {};

    if (typeof height !== 'undefined') {
        this.height = height;
    }
    if (typeof width !== 'undefined') {
        this.width = width;
    } else {
        this.width = container.clientWidth;
    }
    if (typeof color !== 'undefined') {
        this.color = color;
    }

    attr.height = this.height;
    attr.width = this.width;
    this.canvas = makeCanvas('canvas', attr);
    this.context = this.canvas.getContext("2d");
    this.context.moveTo(0, this.height);

    window.addEventListener('resize', () => {
        this.canvas.setAttribute('width', 0);
        this.width = container.clientWidth;
        this.canvas.setAttribute('width', this.width);
    });

    container.appendChild(this.canvas);
}

CanvasChart.prototype.draw = function (data) {
    const datum = JSON.parse(data);
    let multiplier = 1;

    if (this.height !== null) {
        multiplier = this.height / 100;
    }

    if (Array.isArray(datum)) {
        for (let i = 0; i < datum.length; i++) {
            this.context.lineTo(this.counter, datum[i].value * multiplier);
            this.counter++;
        }
    } else {
        this.context.lineTo(this.counter, datum.value * multiplier);
    }

    this.counter++;
    this.context.stroke();
};
