
/** @type {CardGenerator}*/
function stumble_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    return{
        name: card_names.stumble_n,
        pic: `${IMG_FOLDER.cards}stumble_n.png`,
        options
    }
}