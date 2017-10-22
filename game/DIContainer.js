define([
    './PlayerCollection',
    './BlocksCollection',
    './BulletService',
    './DOMRender',
    './BaseMovement',
    './node_modules/bottlejs/dist/bottle',
    './Field',
], function({PlayerCollection}, {BlocksCollection}, {BulletService}, {DOMRender}, {BaseMovement}, Bottle, Field){
    /** @var Bottle **/
    let container = new Bottle();

    //simple mapping
    container.value('field', Field);


    //normal
    container.service(PlayerCollection.name, function(){
        return new PlayerCollection();
    });

    container.service(BlocksCollection.name, function(){
        return new BlocksCollection();
    });

    container.service(BulletService.name, function(players){
        let service = new BulletService();

        service.init(players);

        return service;
    }, PlayerCollection.name);


    container.service(DOMRender.name, function(field){
        return new DOMRender(field);
    }, 'field');

    //tricks
    BaseMovement.field = Field;

    return {
        container,
        get(name){
            return container.container[name];
        }
    };
});