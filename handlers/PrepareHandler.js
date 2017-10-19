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
        }
    };
});