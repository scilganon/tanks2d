define([
    './node_modules/lodash/lodash',
    './BaseMovement'
],function (_, {BaseMovement}) {
    class Shell {
        /**
         * @param {Player} player
         */
        constructor(player) {
            this.player = player;
            this.movement = BaseMovement.clone(player.movement);
        }
    }

    return {
        Shell
    };
});