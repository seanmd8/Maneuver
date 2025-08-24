
/** @type {CardGenerator}*/
function stunning_leap_horizontal(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(E, [pmove(2, 0), ...spin]);
    options.add_button(W, [pmove(-2, 0), ...spin]);
    return{
        name: `stunning leap horizontal`,
        pic: `${IMG_FOLDER.cards}stunning_leap_horizontal.png`,
        options
    }
}