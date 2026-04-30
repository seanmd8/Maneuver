/** @type {CardGenerator} */
function repeating_leap_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pmove(0, -2)]);
    options.add_button(S, [pmove(0, 2)]);
    options.make_repeating();
    return{
        name: card_names.repeating_leap_n,
        pic: `${IMG_FOLDER.cards}repeating_leap_n.png`,
        options
    }
}