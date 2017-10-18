define([
    './BaseMovement'
],function ({BaseMovement}) {
    const STATUSES = {
        ALIVE: 'alive',
        DEAD: 'dead'
    };

    class Player {
        constructor(name, color = '#000') {
                this.status = STATUSES.ALIVE;
                this.color = color;
                this.name = name;
                this.movement = new BaseMovement();
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