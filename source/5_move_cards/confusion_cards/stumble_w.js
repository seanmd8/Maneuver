
/** @type {CardGenerator}*/
function stumble_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: card_names.stumble_w,
        pic: `${IMG_FOLDER.cards}stumble_w.png`,
        options
    }
}