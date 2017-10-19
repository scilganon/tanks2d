var express = require('express')
var serveStatic = require('serve-static')
var SSE = require('sse')

var app = express()
app.use(serveStatic(__dirname))

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());


var _ = require('lodash');

let users = [];
let blocks = new Map();
let gConnection = {
    _connection: null,
    send(event, data){
        if(data instanceof Object){
            data = JSON.stringify(data);
        }

        this._connection.send(event, data);
    }
};

app.post('/event', function(req, res){
    var data = req.body.data;

    switch(req.body.event){
        case 'newuser':
            res.end();
            users.push(data);
            gConnection.send('newuser', data);
            break;
        case 'move':
            _.find(blocks, {
                id: data.id
            }).merge(data);
            res.end();
            break;
        default:
            res.status(500).send('unknown event');
    }
});

var server = app.listen(8080, function (err) {
    if (err) throw err
    console.log('server ready on http://localhost:8080')
})

var sse = new SSE(server)
sse.on('connection', function (connection) {
    console.log('new connection');

    gConnection._connection = connection;

    connection.on('close', function () {
        console.log('lost connection')
    })
})
