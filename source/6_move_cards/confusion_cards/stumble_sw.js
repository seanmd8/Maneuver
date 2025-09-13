/** @type {CardGenerator}*/
function stumble_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: card_names.stumble_sw,
        pic: `${IMG_FOLDER.cards}stumble_sw.png`,
        options
    }
}