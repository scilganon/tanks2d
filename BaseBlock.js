define([
    './BaseMovement'
], function({BaseMovement}){
    class BaseBlock {

        constructor() {
            this.movement = new BaseMovement();
        }
    }

    return {
        BaseBlock
    };
});