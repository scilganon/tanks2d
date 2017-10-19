define(function(require){
    const NetworkService = require('./NetworkService');
    const EVENTS_ENUM = require('./EVENTS_ENUM');

    NetworkService
        .connect()
        .then(() => NetworkService.sync(EVENTS_ENUM.NEWUSER, {
            name: 'player'
        }))
        .then(() => require('./game'));
});