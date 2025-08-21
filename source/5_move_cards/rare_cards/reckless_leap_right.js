
/** @type {CardGenerator}*/
function reckless_leap_right(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(E, [pstun(0, 0), pmove(2, 0), ...spin]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `reckless leap right`,
        pic: `${IMG_FOLDER.cards}reckless_leap_right.png`,
        options
    }
}