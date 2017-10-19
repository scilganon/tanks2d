"use strict";

require([
    './node_modules/lodash/lodash',
    './Field',
    './PlayerCollection',
    './BlocksCollection',
    './BulletService',
    './DOMRender',
    './BaseMovement'
],
    /**
     * @param _
     * @param {Field} field
     * @param PlayerCollection
     * @param BlocksCollection
     * @param BulletService
     * @param DOMRender
     * @param BaseMovement
     * @param {BulletService} firing
     */
    function(_, field, {PlayerCollection}, {BlocksCollection}, {BulletService}, {DOMRender}, {BaseMovement}){
        //tricks
        BaseMovement.field = field;

        //init
        /** @var PlayerCollection **/
        let players = new PlayerCollection();

        players.add('Max');

        /** @var BlocksCollection **/
        let blocks = new BlocksCollection();

        /** @var BulletService **/
        let firing = new BulletService();

        /** @var DOMRender **/
        let render = new DOMRender(field);

        // game
        field.init();
        players.init((player) => {
            render.register(player, {
                backgroundColor: player.color,
                width: field.dom.style.cell.size,
                height: field.dom.style.cell.size
            });
        });
        blocks.init((block) => {
            render.register(block, {
                backgroundColor: '#ccc',
                width: field.dom.style.cell.size,
                height: field.dom.style.cell.size
            })
        });

        firing.init(players);

        //run
        setInterval(() => {
            firing.process((pos, shooter) => {
                if(blocks.hasCollision(pos)){
                    return true;
                }

                let player = players.hasCollision(pos);

                if(player && player !== shooter){
                    players.kill(render, player);
                    return true;
                }
            }).forEach((shell) => {
                render.unregister(shell);
            });
            render.update();
        }, 100);

        let fire = _.throttle((player) => {
            firing.fire(player, (shell)=> {
                render.register(shell, {
                    backgroundColor: 'red',
                    width: field.dom.style.cell.size,
                    height: field.dom.style.cell.size
                });
            });
        }, 200);

        // controls
        document.addEventListener('keydown', (e) => {
            /** @var {Player} **/
            let player = players.list[0];

            if(/^Arrow.+/gi.test(e.code)){
                player.move(
                    e.code.replace('Arrow', '').toUpperCase(),
                    (pos) => blocks.hasCollision(pos)
                );
            }

            if(/Space/gi.test(e.code)){
                fire(player);
            }
    });
});