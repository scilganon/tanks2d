define([
    './Position'
],function (Position) {
    const DIRECTIONS = {
        UP: 'UP',
        DOWN: 'DOWN',
        LEFT: 'LEFT',
        RIGHT: 'RIGHT'
    };

    class BaseMovement {

        constructor() {
            this.direction = null;
            this.field = BaseMovement.field;

            this.position = new Position();
            this.newPosition = null;
        }

        move(dir){
            this.direction = dir = dir || this.direction;
            this.newPosition = new Position(this.position.x, this.position.y);

            switch(dir){
                case DIRECTIONS.RIGHT:
                case DIRECTIONS.LEFT:
                    this.newPosition.x = (this.field.size.width + this.position.x-1+2*(dir === DIRECTIONS.RIGHT))%this.field.size.width;
                    break;
                case DIRECTIONS.UP:
                case DIRECTIONS.DOWN:
                    this.newPosition.y = (this.field.size.height + this.position.y-1+2*(dir === DIRECTIONS.DOWN))%this.field.size.height;
                    break;
                default:
                    throw new Error('unknown direction to move');
            }

            return this.newPosition;
        }

        commit(){
            this.position.x = this.newPosition.x;
            this.position.y = this.newPosition.y;
        }

        rollback(){
            delete this.newPosition;
        }
    }

    BaseMovement.field = null;

    /**
     * @param {BaseMovement} source
     * @returns {BaseMovement}
     */
    BaseMovement.clone = function(source){
        let entity = new BaseMovement();

        entity.direction = source.direction;
        entity.position = Position.clone(source.position);

        return entity;
    };

    return {
        BaseMovement,
        DIRECTIONS
    };
});