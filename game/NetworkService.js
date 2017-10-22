define([
    './node_modules/js-cookie/src/js.cookie',
    './node_modules/axios/dist/axios'
], function(Cookie, axios){
    var connection;
    var connId = Cookie.get('ci');

    const config = {
        sse: 'http://localhost:8080/sse',
        events: 'http://localhost:8080/event'
    };

    return {
        validateConnectionId(){
            let promise;

            if(!connId){
               promise = axios.get('/config').then(({data}) => {
                   connId = data.uuid;
                   Cookie.set('ci', connId);
               })
            } else {
                promise = Promise.resolve(connId);
            }

            return promise;
        },

        connect(){
            return this.validateConnectionId()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        connection = new EventSource(config.sse);

                        connection.addEventListener('open', () => resolve());
                        connection.addEventListener('error', () => reject());
                    })
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