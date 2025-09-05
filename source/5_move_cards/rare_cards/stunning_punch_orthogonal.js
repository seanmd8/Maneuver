/** @type {CardGenerator}*/
function stunning_punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(0, -1)]);
    options.add_button(E, [pstun(1, 0), pstun(1, 0)]);
    options.add_button(S, [pstun(0, 1), pstun(0, 1)]);
    options.add_button(W, [pstun(-1, 0), pstun(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.stunning_punch_orthogonal,
        pic: `${IMG_FOLDER.cards}stunning_punch_orthogonal.png`,
        options
    }
}