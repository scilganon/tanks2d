define([
    '../DIContainer'
], function(DIContainer){
    return {
        handle(state){
            /** @var BlocksCollection **/
            let blocks = DIContainer.get('BlocksCollection');
            let render = DIContainer.get('DOMRender');

            state.blocks.forEach((block) => {
                blocks.add(block.x, block.y);
            });

            blocks.init((block) => {
                render.register(block, {
                    backgroundColor: '#ccc',
                    width: 30,
                    height: 30
                })
            });

            /** @var PlayerCollection **/
            let players = DIContainer.get('PlayerCollection');

            state.users.forEach((user) => {
                let player = players.add(user.id);

                player.setPosition(state.start.x, state.start.y);
            });

            players.init((player) => {
                render.register(player, {
                    backgroundColor: player.color,
                    width: 30,
                    height: 30
                });
            });
        }
    };
});