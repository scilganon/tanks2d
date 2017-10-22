define([
    './DIContainer'
], function(DIContainer){
    var id;

    return {
        generateId(){
            id = Date.now();
            return id;
        },
        get id(){
            return id;
        },

        get current(){
            return DIContainer.get('PlayerCollection').find((player) => player.id === id);
        }
    };
});