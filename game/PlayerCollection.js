define([
    './Player',
    './CollisionService',
], function({Player, STATUSES}, CollisionService){
    class PlayerCollection {

        constructor() {
            this.list = [];
        }

        add(id, name = 'player'){
            /** @var Player **/
            let entity = new Player();
            entity.setName(name);
            entity.setId(id);
            this.list.push(entity);
            return entity;
        }

        init(connectorCb){
            this.list.forEach((player) => {
                connectorCb(player);
            });
        }
        hasCollision(pos){
            return CollisionService.hasCollision(this.list, pos);
        }
        getAlive(){
            return this.list.filter((player) => player.status === STATUSES.ALIVE);
        }

        /**
         * @param {DOMRender} render
         * @param {Player} player
         */
        kill(render, player){
            player.status = STATUSES.DEAD;
            render.unregister(player);
        }

        findById(id){
            return this.list.find((player) => player.id === id);
        }

        find(){
            return this.list.find.apply(this.list, arguments);
        }
    }

    return {
        PlayerCollection
    };
});