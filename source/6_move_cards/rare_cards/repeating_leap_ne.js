
/** @type {CardGenerator} */
function repeating_leap_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(0, 0), pmove(2, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pstun(0, 0), pmove(-2, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    options.make_repeating();
    return{
        name: card_names.repeating_leap_ne,
        pic: `${IMG_FOLDER.cards}repeating_leap_ne.png`,
        options
    }
}