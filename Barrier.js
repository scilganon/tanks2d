define([
    './BaseBlock'
], function ({BaseBlock}) {
    class Barrier extends BaseBlock{

        constructor(color) {
            super(color);

            this.movement.position.x = 1;
            this.movement.position.y = 1;
        }
    }

    return {
        Barrier
    };
});