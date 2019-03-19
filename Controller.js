
//Controller
function Controller(model) {
    let current = null;

    function getRandomTime() {
        return Math.round((new Date()).getTime() / 1000);
    }

    function getRandomValue(min = 0, max = 100) {//возвращает случайное число, но которое не равно нулю (чтобы не было шариков которые вечно двигаются только строго вертикально или горизонтально)
        return Math.floor(Math.random() * (max - min)) + min;
    }

    this.generateElement = function () {
        const time = getRandomTime();
        const value = getRandomValue();
        return {
            time,
            value,
        };
    };

    this.getCurrent = function () {
        return current;
    };

    this.subscribers = [];//подписчики на рождение нового случайного числа

    //подписаться на получение сообщения о рождении нового случайного числа
    //(в частности WebSocketApi)
    this.subscribe = function (callback) {
        this.subscribers.push(callback);
    };

    this.cycle = () => {//выполняется каждую секунду (колбэк для setInterval)
        let current = this.generateElement();
        model.push(current);//сохраняет новое значение в модели
        for (let i = 0; i < this.subscribers.length; i++) {
            //оповещает подписчиков на событие рождения числа (в частности WebSocketApi)
            this.subscribers[i](current);
        }
    };

    this.init = function () {
        const express = require('express');
        const RestApi = require('./RestApi');
        const WEbSocketApi = require('./WebSocketApi');

        const app = express();
        app.use(express.static('public'));
        RestApi(app, this, model);//запускает REST API
        WEbSocketApi(app, this, model);//запускает WS API
        app.listen(3000, () => {
            console.log('listening port...');
            model.init();
            setInterval(this.cycle, 1000);
        });
    };
}

module.exports = Controller;