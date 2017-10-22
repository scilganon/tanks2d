define(function(){
    return {
        hasCollision(list, pos){
            return list.find((block) => {
                return block.movement.position.x === pos.x && block.movement.position.y === pos.y;
            });
        }
    };
});