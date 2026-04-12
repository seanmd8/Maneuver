/** @type {CardGenerator} */
function repeating_retreat(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    options.make_repeating();
    options.make_instant();
    return{
        name: card_names.repeating_retreat,
        pic: `${IMG_FOLDER.cards}repeating_retreat.png`,
        options
    }
}