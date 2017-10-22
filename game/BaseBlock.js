define([
    './BaseMovement'
], function({BaseMovement}){
    class BaseBlock {

        constructor() {
            this.movement = new BaseMovement();
        }

        setPosition(x,y){
            this.movement.position.x = x;
            this.movement.position.y = y;
        }
    }

    return {
        BaseBlock
    };
});