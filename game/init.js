define(function(require){
    const NetworkService = require('./NetworkService');
    const EVENTS_ENUM = require('./EVENTS_ENUM');

    window.prepare = function(){
        NetworkService.sync('start');
    };

    NetworkService
        .connect()
        .then(() => NetworkService.sync(EVENTS_ENUM.NEWUSER, {
            id: 'player'+Date.now()
        }))
        .then(() => {
            let prepare = require('./handlers/PrepareHandler');
            let start = require('./handlers/StartHandler');

            NetworkService.subscribe('prepare', (msg) => prepare.handle(JSON.parse(msg.data)));
            NetworkService.subscribe('start', (msg) => start.handle(JSON.parse(msg.data)));
        })
        .then(() => require('./game'));
});