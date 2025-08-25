
/** @type {CardGenerator}*/
function stumble_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    return{
        name: card_names.stumble_e,
        pic: `${IMG_FOLDER.cards}stumble_e.png`,
        options
    }
}