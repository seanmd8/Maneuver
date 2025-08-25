
/** @type {CardGenerator}*/
function stunning_tread_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(0, -1), pstun(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(1, 0), pstun(1, 0), pstun(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 1), pstun(0, 1), pstun(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(-1, 0), pstun(-1, 0), pstun(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.stunning_tread_orthogonal,
        pic: `${IMG_FOLDER.cards}stunning_tread_orthogonal.png`,
        options
    }
}