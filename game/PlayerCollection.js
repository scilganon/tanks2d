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

        /**
         * @param pos
         * @returns {Player|null}
         */
        hasCollision(pos){
            return CollisionService.hasCollision(this.getAlive(), pos);
        }
        getAlive(){
            return this.list.filter((player) => player.status === STATUSES.ALIVE);
        }

        /**
         * @param {Player} player
         */
        kill(player){
            player.status = STATUSES.DEAD;
        }

        /**
         * @param id
         * @returns {Player|null}
         */
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