define(function () {
    let list = new Set();

    return {
        /**
         * @param {BaseBlock} block
         */
        register(block){
            list.add(block.movement);
        },

        unregister(block){
            list.delete(block.movement);
        }
    };
});