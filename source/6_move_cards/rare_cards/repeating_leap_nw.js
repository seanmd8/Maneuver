
/** @type {CardGenerator} */
function repeating_leap_nw(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    options.make_repeating();
    return{
        name: card_names.repeating_leap_nw,
        pic: `${IMG_FOLDER.cards}repeating_leap_nw.png`,
        options
    }
}