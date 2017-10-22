define(function () {
    /**
     * @class Field
     */
    return {
        dom: {
            el: document.getElementById('field'),
            style: {
                cell: {
                    size: 30
                }
            }
        },
        size: {
            width: 10,
            height: 10
        },
        init(){
            this.dom.el.style.width = this.size.width * this.dom.style.cell.size + 'px';
            this.dom.el.style.height = this.size.height * this.dom.style.cell.size + 'px';
        }
    };
});