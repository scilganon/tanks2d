define(function(require){
    const NetworkService = require('./NetworkService');
    const EVENTS_ENUM = require('./EVENTS_ENUM');
    const UserService = require('./UserService');

    window.prepare = function(){
        NetworkService.sync('start');
    };

    NetworkService
        .connect()
        .then(() => NetworkService.sync(EVENTS_ENUM.NEWUSER, {
            id: UserService.generateId()
        }))
        .then(() => {
            let prepare = require('./handlers/PrepareHandler');
            let start = require('./handlers/StartHandler');

            NetworkService.subscribe('prepare', (msg) => prepare.handle(msg));
            NetworkService.subscribe('start', (msg) => start.handle(msg));
        })
        .then(() =>  require(['./game']));
});