define([
    './BaseBlock'
],function ({BaseBlock}) {
    class Shell extends BaseBlock{

        constructor() {
            super();

            this.id = Date.now();
            this.player = null;
        }

        /**
         * @param {Player} player
         */
        setPlayer(player){
            this.player = player;
        }

        setId(val){
            this.id = val;
        }
    }

    return {
        Shell
    };
});