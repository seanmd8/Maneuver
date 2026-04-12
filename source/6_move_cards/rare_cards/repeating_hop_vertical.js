
/** @type {CardGenerator} */
function repeating_hop_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(S, [pmove(0, 2)]);
    options.make_repeating();
    return{
        name: card_names.repeating_hop_vertical,
        pic: `${IMG_FOLDER.cards}repeating_hop_vertical.png`,
        options
    }
}