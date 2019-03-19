//Common
const express = require('express');
const app = express();
const MAX_LENGTH = 1000;
app.use(express.static('public'));

//Model
const fs = require('fs');
const data = [];
const fileName = 'data.csv';
function checkArrSize(){
    if (data.length > MAX_LENGTH - 1) {
        data.splice(0, data.length - (MAX_LENGTH - 1));
    }
}
function saveArr(){
    let tmp = [];
    for (let i = 0; i < data.length; i++) {
        tmp.push(`${data[i].time},${data[i].value}`);
    }
    fs.writeFile(fileName, tmp.join('\n'));
} //*****
function init(){
    fs.readFile(fileName, (err, fileData) => {
        if (err) {
            return;
        }
        if (fileData.toString() === '') {
            return;
        }
        let arr = fileData.toString().split('\n');
        for (let i = 0; i < arr.length; i++) {
            let tmp = arr[i].split(',');
            data.push({time: tmp[0], value: tmp[1]});
        }
    })
}

//Control
let current = null;
function getRandomTime(){
    return Math.round((new Date()).getTime() / 1000);
}
function getRandomValue(min = 0, max = 100) {//возвращает случайное число, но которое не равно нулю (чтобы не было шариков которые вечно двигаются только строго вертикально или горизонтально)
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateElement(){
    let ts = getRandomTime();
    let randVal = getRandomValue();

    current = {"time": ts, "value": randVal};

    checkArrSize();
    data.push(current);
    return current;
}


//REST API
app.get('/api/history', (req, res) => {
   res.send(JSON.stringify(data));
});
app.get('/api/current', (req, res) => {
    res.send(JSON.stringify(current));
});


//WebSocket API
const enableWs = require('express-ws');
const expressWs = enableWs(app);
const clients = [];

expressWs.getWss().on('connection', ws => {
    clients.push(ws);
    if (!data.length) {
        return;
    }
    ws.send(JSON.stringify(data));
});

app.ws('/ws', ws => {
    ws.on('message', msg => {
    });

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


app.listen(3000, () => {
    console.log('listening port...');
    init();
    // fs.readFile(fileName, (err, fileData) => {
    //     if (err) {
    //         return;
    //     }
    //     if (fileData.toString() === '') {
    //         return;
    //     }
    //     let arr = fileData.toString().split('\n');
    //     for (let i = 0; i < arr.length; i++) {
    //         let tmp = arr[i].split(',');
    //         data.push({time: tmp[0], value: tmp[1]});
    //     }
    //})
    setInterval(() => {
        //let ts = getRandomTime();
        //let randVal = getRandomValue();
        generateElement();
        /*const maxLen = 100;
        if (data.length > maxLen - 1) {
            data.splice(0, data.length - (maxLen - 1));
        }
        current = {"time": ts, "value": randVal};
        data.push(current);*/
        saveArr();
        // let tmp = [];
        // for (let i = 0; i < data.length; i++) {
        //     tmp.push(`${data[i].time},${data[i].value}`);
        // }
        // fs.writeFile(fileName, tmp.join('\n'));

        sendAllClients(JSON.stringify(current));
    }, 1000);
});



//Реализовать сервер, который:
//хранит массив объектов типа { time: number, value: number }, который инициализируется из файла data.csv;
//максимальное число элементов массива 1000;
//каждую секунду сервер генерирует новое случайное значение в диапазоне 0 - 100;
//новое значение и время добавляется в массив объектов, при этом массив сохраняется в файл data.csv;

//Сервер имеет следующий роутинг:
//GET api/current возвращает текущее значени (первый элемент массива) { time: number, value: number }
//GET api/history возвращает массив всех значений [{ time: number, value: number }]

//Сервер имеет возможность подключения клиентов по WebSocket
//при каждом подключении клиента сервер отсылает подключившемуся клиенту массив всех значений [{ time: number, value: number }]
//при каждом создании нового значения сервер рассылает всем клиентам новое значение { time: number, value: number }

//Сервер хранит в директории public две страницы html (RestExample.html, WsExample.html)

//Страница RestExample.html работает с сервером по REST
//при запуске инициируется запрос на сервер GET api/history для получения всех значений [{ time: number, value: number }]
//при запуске создается интервал в котором каждую секунду осуществляется запрос GET api/current
//на странице присутствуют два графика (canvas и svg)
//графики в реальном времени отображают значения полученные с сервера (обновление происходит при получении текущего значения)

//Страница WsExample.html работает с сервером по WebSocket
//при запуске инициируется connect к серверу по ws
//в ответ на connect сервер присылает массив всеч значений [{ time: number, value: number }]
//на каждый onmessage с сервера приходит новое значение
//на странице присутствуют два графика (canvas и svg)
//графики в реальном времени отображают значения полученные с сервера (обновление происходит при получении текущего значения)
