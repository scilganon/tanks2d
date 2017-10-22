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

let users = {
    list: new Map(),
    add(connection, user){
        this.list.set(connection, user);
    },

    toArray(){
        let result = [];
        this.list.forEach((user) => result.push(user));

        return result
    },

    remove(connection){
        const id = cookie.parse(connection.req.headers.cookie).ci;

        this.list.delete(id);
    },
};

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
        } else {
            data = '' + data;
        }

        this._connections.forEach((conn) => {
            conn.send(event, data);
        });
    },

    getById(id){
        return this._connections.get(id);
    }
};

var config = {
    size: 10
};

var uuid = require('uuid/v1');

app.get('/config', function(req, res){
    res.json(Object.assign({
        uuid: uuid()
    }, config)).end();
});

function createBlock(x,y){
    return {
        x,
        y,
        id: _.uniqueId('block_')
    };
}

function createState(users){
    return {
        created_at: Date.now(),
        start: {
            x: 0,
            y: 0
        },
        blocks: [
            createBlock(1,1),
            createBlock(1,2)
        ],
        users: users.toArray()
    };
}

app.post('/event', function(req, res){
    var data = req.body.data;
    var id = cookie.parse(req.headers.cookie).ci;

    switch(req.body.event){
        case 'kill':
            //@todo: check exact coords of clash bullet and player
            connectionPull.send('kill', data);
            res.end();
        case 'newuser':
            if(users.toArray().find((user) => user.id === data.id)){
                res.status(500).send('user already exists with such name');
                return;
            }

            res.end();
            users.add(id, data);
            connectionPull.send('newuser', data);
            break;
        case 'move':
            connectionPull.send('move', data);
            res.end();
            break;
        case 'start':
            let state = createState(users);
            connectionPull.send('prepare', state);
            setTimeout(function(){
                connectionPull.send('start', {
                    round: state.created_at
                });
                state = null;
            }, 1500);
            res.end();
            break;
        case 'reset':
            connectionPull.send('reset', {success: true});
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

        users.remove(this);


        connectionPull.remove(this);
    })
})
