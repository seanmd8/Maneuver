
/** @type {CardGenerator}*/
function stumble_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    return{
        name: card_names.stumble_se,
        pic: `${IMG_FOLDER.cards}stumble_se.png`,
        options
    }
}