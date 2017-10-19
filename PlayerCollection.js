define([
    './Player',
    './CollisionService',
], function({Player, STATUSES}, CollisionService){
    class PlayerCollection {

        constructor() {
            this.list = [];
        }

        add(name = 'player'){
            /** @var Player **/
            let entity = new Player();
            entity.setName(name);
            this.list.push(entity);
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
    }

    return {
        PlayerCollection
    };
});