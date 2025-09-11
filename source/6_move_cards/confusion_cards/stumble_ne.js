/** @type {CardGenerator}*/
function stumble_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: card_names.stumble_ne,
        pic: `${IMG_FOLDER.cards}stumble_ne.png`,
        options
    }
}