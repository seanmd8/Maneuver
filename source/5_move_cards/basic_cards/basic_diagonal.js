
/** @type {CardGenerator}*/
function basic_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: card_names.basic_diagonal,
        pic: `${IMG_FOLDER.cards}basic_diagonal.png`,
        options,
        basic: true
    }
}