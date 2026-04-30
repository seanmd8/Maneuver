
/** @type {CardGenerator} */
function repeating_leap_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(SW, [pmove(-2, 1)]);
    options.make_repeating();
    return{
        name: card_names.repeating_leap_ne,
        pic: `${IMG_FOLDER.cards}repeating_leap_ne.png`,
        options
    }
}