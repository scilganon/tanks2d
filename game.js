"use strict";

require([
    './node_modules/lodash/lodash',
    './Field',
    './DIContainer'
],
    /**
     * @param _
     * @param {Field} field
     * @param DIContainer
     */
    function(_, field, DIContainer){
        /** @var PlayerCollection **/
        let players = DIContainer.get('PlayerCollection');

        /** @var BlocksCollection **/
        let blocks = DIContainer.get('BlocksCollection');

        /** @var BulletService **/
        let firing = DIContainer.get('BulletService');

        /** @var DOMRender **/
        let render = DIContainer.get('DOMRender');

        // init
        field.init();
        players.init((player) => {
            render.register(player, {
                backgroundColor: player.color,
                width: field.dom.style.cell.size,
                height: field.dom.style.cell.size
            });
        });

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