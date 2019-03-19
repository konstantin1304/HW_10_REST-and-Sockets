
//Model
function FileModel(MAX_LENGTH) {
    const fs = require('fs');
    const data = [];
    const fileName = 'data.csv';

    function checkArrSize() {
        if (data.length > MAX_LENGTH - 1) {
            data.splice(0, data.length - (MAX_LENGTH - 1));
        }
    }

    this.push = function (current) {
        checkArrSize();
        data.push(current);
        saveArr();
    };

    function saveArr() {
        let tmp = [];
        for (let i = 0; i < data.length; i++) {
            tmp.push(`${data[i].time},${data[i].value}`);
        }
        fs.writeFile(fileName, tmp.join('\n'));
    }

    this.getData = function () {
        return data;
    };

    this.init = function () {
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
        });
    };
}

module.exports = FileModel;