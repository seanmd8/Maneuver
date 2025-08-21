
/** @type {CardGenerator}*/
function stunning_side_leap(){
    var spin = ALL_DIRECTIONS.map(p => pstun(p.x, p.y));
    var options = new ButtonGrid();
    options.add_button(E, [pmove(2, 0), ...spin]);
    options.add_button(W, [pmove(-2, 0), ...spin]);
    return{
        name: `stunning_side_leap`,
        pic: `${IMG_FOLDER.cards}stunning_side_leap.png`,
        options
    }
}