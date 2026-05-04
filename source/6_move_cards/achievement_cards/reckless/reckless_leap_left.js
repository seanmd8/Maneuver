/** @type {CardGenerator}*/
function reckless_leap_left(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(W, [pstun(0, 0), pmove(-2, 0), ...spin]);
    options.add_button(E, [pmove(1, 0)]);
    return{
        name: card_names.reckless_leap_left,
        pic: `${IMG_FOLDER.cards}reckless_leap_left.png`,
        options
    }
}