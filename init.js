define(function(require){
    const NetworkService = require('./NetworkService');
    const EVENTS_ENUM = require('./EVENTS_ENUM');

    window.prepare = function(){
        NetworkService.sync('start');
    }

    NetworkService
        .connect()
        .then(() => NetworkService.sync(EVENTS_ENUM.NEWUSER, {
            name: 'player'+Date.now()
        }))
        .then(() => {
            let handler = require('./handlers/PrepareHandler');

            NetworkService.subscribe('prepare', (msg) => handler.handle(JSON.parse(msg.data)));
        })
        .then(() => require('./game'));
});