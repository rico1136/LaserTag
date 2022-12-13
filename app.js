// Importing express module
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

let data;

let allGames = [];

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/game', function(req, res) {
    res.sendFile(__dirname + '/game.html');
});

app.get('/getGameData', (req, res) => {
    console.log('got get');
    allGames = [];
    const jsonsInDir = fs.readdirSync('./JsonFiles').filter(file => path.extname(file) === '.json');

    jsonsInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join('./JsonFiles', file));
        const json = JSON.parse(fileData.toString());
        console.log(json['Date']);

        if(json['Date'] === req.query.Game)
        {
            console.log(json);
            allGames.push(json);
        }
    });

    var tryFetch = {AllGames: allGames};

    res.json(tryFetch)
});

app.post('/postData', (req, res) => {
    console.log('got post');

    data = JSON.stringify(req.body);
    console.log(data);
    fs.writeFile('JsonFiles/' + req.body.FileName + '.json', data, 'utf8', callback => console.log('done'));
    
    res.send(req.body);
});



app.get('/getData', (req, res) => {
    console.log('got get');
    allGames = [];
    const jsonsInDir = fs.readdirSync('./JsonFiles').filter(file => path.extname(file) === '.json');

    jsonsInDir.forEach(file => {
        const fileData = fs.readFileSync(path.join('./JsonFiles', file));
        let json = JSON.parse(fileData.toString());

        allGames.push(json);
    });

    allGames.sort(function(a, b) {
        return new Date(b['Date']) - new Date(a['Date']);
    });

    console.log(allGames);

    var tryFetch = {AllGames: allGames};

    res.json(tryFetch)
});

app.listen(3000, () => {
    console.log('Our express server is up on port 3000');
});

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}