
/** @type {CardGenerator}*/
function stunning_leap(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -2), ...spin]);
    options.add_button(S, [pmove(0, 2), ...spin]);
    return{
        name: `stunning_leap`,
        pic: `${IMG_FOLDER.cards}stunning_leap.png`,
        options
    }
}