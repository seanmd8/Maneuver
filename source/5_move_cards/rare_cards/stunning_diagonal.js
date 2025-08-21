
/** @type {CardGenerator}*/
function stunning_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(1, -1), pstun(1, -1), pstun(1, -1), pmove(1, -1)]);
    options.add_button(SE, [pstun(1, 1), pstun(1, 1), pstun(1, 1), pmove(1, 1)]);
    options.add_button(SW, [pstun(-1, 1), pstun(-1, 1), pstun(-1, 1), pmove(-1, 1)]);
    options.add_button(NW, [pstun(-1, -1), pstun(-1, -1), pstun(-1, -1), pmove(-1, -1)]);
    return{
        name: `stunning diagonal`,
        pic: `${IMG_FOLDER.cards}stunning_diagonal.png`,
        options
    }
}