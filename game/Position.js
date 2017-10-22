define(function () {
    class Position {

        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
    }

    /**
     * @param {Position} source
     * @returns {Position}
     */
    Position.clone = function(source){
        return new Position(source.x, source.y);
    };

    return Position;
});