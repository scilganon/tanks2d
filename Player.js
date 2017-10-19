define([
    './BaseBlock',
],function ({BaseBlock}) {
    const STATUSES = {
        ALIVE: 'alive',
        DEAD: 'dead'
    };

    class Player extends BaseBlock{
        constructor() {
            super();

            this.status = STATUSES.ALIVE;
            this.color = '#000';
            this.name = 'player';
        }

        setColor(val){
            this.color = val;
        }

        setName(val){
            this.name = val;
        }

        move(dir, hasCollisionsCb){
            let newPos = this.movement.move(dir);

            if(hasCollisionsCb(newPos)) {
                console.warn('crashed');
                this.movement.rollback();
                return false;
            }

            this.movement.commit();

            return true;
        }
    }

    return {
        Player,
        STATUSES
    };
});