define([
    './node_modules/axios/dist/axios'
], function(axios){
    var connection;

    const config = {
        sse: 'http://localhost:8080/sse',
        events: 'http://localhost:8080/event'
    };

    return {
        connect(){
            return new Promise((resolve, reject) => {
                connection = new EventSource(config.sse);

                connection.addEventListener('open', () => resolve());
                connection.addEventListener('error', () => reject());
            });
        },
        subscribe(event, cb){
            if(!connection){
                throw new Error('connection is not established');
            }

            return connection.addEventListener(event, cb);
        },
        sync(event, data){
            return axios.post(config.events, {
                event,
                data
            });
        }
    };
});