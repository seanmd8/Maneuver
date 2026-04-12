
/** @type {CardGenerator} */
function repeating_leap_nw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pstun(0, 0), pmove(2, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pstun(0, 0), pmove(-2, -1)]);
    options.make_repeating();
    return{
        name: card_names.repeating_leap_nw,
        pic: `${IMG_FOLDER.cards}repeating_leap_nw.png`,
        options
    }
}