define([
    './node_modules/bottlejs/dist/bottle',
    './Player'
], function(Bottle){
    /** @var Bottle **/
    let container = new Bottle();

    container.service('Player', function(){

    });

    return container();
});