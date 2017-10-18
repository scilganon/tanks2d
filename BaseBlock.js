define([
    './BaseMovement'
], function({BaseMovement}){
    class BaseBlock {

        constructor(color) {
            this.movement = new BaseMovement();

            this.movement.position.x = 1;
            this.movement.position.y = 1;
        }
    }

    return {
        BaseBlock
    };
});