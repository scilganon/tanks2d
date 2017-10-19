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
var cookie = require('cookie');

let users = new Map();
let blocks = new Map();
let connectionPull = {
    _connections: new Map(),

    add(connection){
        const id = cookie.parse(connection.req.headers.cookie).ci;

        this._connections.set(id, connection);
    },

    remove(connection){
        const id = cookie.parse(connection.req.headers.cookie).ci;

        this._connections.delete(id);
    },

    send(event, data){
        if(data instanceof Object){
            data = JSON.stringify(data);
        }

        this._connections.forEach((conn) => {
            conn.send(event, data);
        });
    }
};

var uuid = require('uuid/v1');

app.get('/config', function(req, res){
    res.json({
        uuid: uuid()
    }).end();
});

app.post('/event', function(req, res){
    var data = req.body.data;

    switch(req.body.event){
        case 'newuser':
            if(users.has(data.name)){
                res.status(500).send('user already exists with such name');
                return;
            }

            res.end();
            users.set(data.name, data);
            connectionPull.send('newuser', data);
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

    connectionPull.add(connection);

    connection.on('close', function () {
        console.log('lost connection');
        connectionPull.remove(this);
    })
})
