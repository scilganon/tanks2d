define([
    './BaseBlock'
], function ({BaseBlock}) {
    class Barrier extends BaseBlock{

        constructor(color) {
            super(color);
        }
    }

    return {
        Barrier
    };
});