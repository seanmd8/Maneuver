
/** @type {CardGenerator} */
function cycling_y(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    options.make_cycling();
    return{
        name: card_names.cycling_y,
        pic: `${IMG_FOLDER.cards}cycling_y.png`,
        options
    }
}