define([
    './Barrier'
],function ({Barrier}) {
    class BlocksCollection {

        constructor() {
            this.list = [];
        }

        clear(){
            this.list = [];
        }

        add(x,y){
            /** @var Barrier **/
            let entity = new Barrier();
            this.list.push(entity);
            entity.setPosition(x,y);
        }

        hasCollision(pos){
            return !!this.list.find((block) => {
                return block.movement.position.x === pos.x && block.movement.position.y === pos.y;
            });
        }

        init(connectorCb){
            this.list.forEach((block) => {
               connectorCb(block);
            });
        }
    }

    return {
        BlocksCollection
    };
});