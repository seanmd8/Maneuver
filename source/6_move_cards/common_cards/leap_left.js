/** @type {CardGenerator}*/
function leap_left(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(W, [pmove(-2, 0)]);
    options.add_button(SW, [pmove(-2, 2)]);

    return{
        name: card_names.leap_left,
        pic: `${IMG_FOLDER.cards}leap_left.png`,
        options
    }
}