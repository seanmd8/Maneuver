
/** @type {CardGenerator}*/
function stumble_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.stumble_s,
        pic: `${IMG_FOLDER.cards}stumble_s.png`,
        options
    }
}