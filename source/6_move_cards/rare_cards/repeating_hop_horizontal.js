
/** @type {CardGenerator} */
function repeating_hop_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(W, [pmove(-2, 0)]);
    options.make_repeating();
    return{
        name: card_names.repeating_hop_horizontal,
        pic: `${IMG_FOLDER.cards}repeating_hop_horizontal.png`,
        options
    }
}