define([], function(){
    class DOMRender {

        /**
         * @param {Field} field
         */
        constructor(field) {
            this.field = field;
            this.list = new Map();
        }

        register(block, style){
            let el = document.createElement('div');

            this.field.dom.el.appendChild(el);

            el.style.backgroundColor = style.backgroundColor;
            el.style.width = style.width + 'px';
            el.style.height = style.height + 'px';


            this.list.set(block, el);
        }
        unregister(block){
            let el = this.list.get(block);
            this.list.delete(block);
            el.remove();
        }
        update(){
            this.list.forEach((el, block) => {
                el.style.left = (block.movement.position.x * this.field.dom.style.cell.size) + 'px';
                el.style.top = (block.movement.position.y * this.field.dom.style.cell.size) + 'px';
            });
        }
    }

    return {
        DOMRender
    };
});