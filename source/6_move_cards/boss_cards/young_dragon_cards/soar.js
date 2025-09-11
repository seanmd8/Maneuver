/** @type {CardGenerator}*/
function soar(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(3, -1)]);
    options.add_button(SE, [pmove(3, 1)]);
    options.add_button(NW, [pmove(-3, -1)]);
    options.add_button(SW, [pmove(-3, 1)]);
    return{
        name: card_names.soar,
        pic: `${IMG_FOLDER.cards}soar.png`,
        options
    }
}