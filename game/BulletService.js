define([
    './Shell',
    './CollisionService',
    './BaseMovement'
], function({Shell}, CollisionService, {BaseMovement}){

    class BulletService {

        constructor() {
            this._list = new Map();
        }

        getShells(){
            let shells = [];

            for(let list of this._list.values()){
                for(let shell of list.values()){
                    shells.push(shell);
                }
            }

            return shells;
        }

        init(players){
            this._list.clear();
            players.list.forEach(function(player){
                this._list.set(player, new Set());
            }.bind(this));
        }
        process(hasCollisionsCb){
            return this.getShells().reduce((toRemoveList, shell) => {
                let newPos = shell.movement.move();

                let targetShell = this.hasCollision(newPos);
                if(hasCollisionsCb(newPos, shell.player) || targetShell){
                    targetShell && toRemoveList.push(targetShell);
                    toRemoveList.push(shell);
                    shell.movement.rollback();
                } else {
                    shell.movement.commit();
                }

                return toRemoveList;
            }, []);
        }

        killShell(shell){
            this._list.get(shell.player).delete(shell);

        }

        /**
         * @param player
         * @param direction
         * @param connectorCb
         * @returns {Shell|null}
         */
        fire(player, direction, connectorCb){
            if(!direction){
                console.warn('unknown direction to fire');
                return;
            }

            /** @var Shell **/
            let shell = new Shell();
            shell.setPlayer(player);
            shell.movement = BaseMovement.clone(player.movement);

            connectorCb(shell);

            this._list.get(player).add(shell);

            return shell;
        }
        hasCollision(pos){
            return CollisionService.hasCollision(this.getShells(), pos);
        }

        findById(id){
            for(let userListShell of this._list.values()){
                for(let bullet of userListShell){
                    if(bullet.id === id){
                        return bullet;
                    }
                }
            }

            return null;
        }
    }

    return {
       BulletService
    }
});