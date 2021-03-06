"use strict";

require([
    './node_modules/lodash/lodash',
    './Field',
    './DIContainer',
    './NetworkService',
    './EVENTS_ENUM',
    './UserService'
],
    /**
     * @param _
     * @param {Field} field
     * @param DIContainer
     * @param NetworkService
     * @param EVENTS_ENUM
     * @param UserService
     */
    function(_, field, DIContainer, NetworkService, EVENTS_ENUM, UserService){
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

        /**
         * @param {Player} player
         */
        let kill = function(player){
            players.kill(player);
            render.unregister(player);
        };

        //run
        setInterval(() => {
            firing.process((pos, shooter) => {
                if(blocks.hasCollision(pos)){
                    return true;
                }

                let player = players.hasCollision(pos);

                if(player && player !== shooter){
                    kill(player);

                    NetworkService.sync('kill', {
                        id: player.id
                    });
                    return true;
                }
            }).forEach((shell) => {
                render.unregister(shell);
            });
            render.update();
        }, 100);

        NetworkService.subscribe('check.kill', ({id}) => {
            let player = players.findById(id);

            if(!player.isDead){
                throw new Error('too old game state - player is already killed');
            }
        });

        let fire = (player, direction, shellId = null) => {
            let shell = firing.fire(player, direction, (shell)=> {
                render.register(shell, {
                    backgroundColor: 'red',
                    width: field.dom.style.cell.size,
                    height: field.dom.style.cell.size
                });
            });

            shellId && shell.setId(shellId);

            return shell;
        };

        let nativeFire = _.throttle((player) => {
            let shell = fire(player, player.movement.direction);

            NetworkService.sync('fire', {
                id: shell.id,
                playerId: player.id,
                direction: player.movement.direction
            })
        }, 200);

        let move = function(player, direction){
            player.move(
                direction,
                (pos) => blocks.hasCollision(pos)
            );
        };

        // controls
        document.addEventListener('keydown', (e) => {
            /** @var {Player} **/
            let player = UserService.current;

            if(/^Arrow.+/gi.test(e.code)){
                let direction = e.code.replace('Arrow', '').toUpperCase();
                move(player, direction);

                NetworkService.sync(EVENTS_ENUM.MOVE, {
                    direction,
                    id: player.id
                });
            }

            if(/Space/gi.test(e.code)){
                nativeFire(player);
            }
        });

        NetworkService.subscribe(EVENTS_ENUM.MOVE, (data) => {
            if(+data.id === UserService.id){
                //ignore self broadcasted events
                return;
            }

            /** @var {Player} player **/
            let player = players.findById(data.id);

            move(player, data.direction);
        });

        NetworkService.subscribe('fire', ({id, direction, playerId}) => {
            if(!firing.findById(id)){
                fire(players.findById(playerId), direction, id)
            }
        });
});