/** @type {CardGenerator}*/
function stunning_slice(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(1, -1), pattack(1, -1), pstun(0, -1), pattack(0, -1), pstun(-1, -1), pattack(-1, -1)]);
    options.add_button(E, [pstun(1, 1), pattack(1, 1), pstun(1, 0), pattack(1, 0), pstun(1, -1), pattack(1, -1)]);
    options.add_button(S, [pstun(1, 1), pattack(1, 1), pstun(0, 1), pattack(0, 1), pstun(-1, 1), pattack(-1, 1)]);
    options.add_button(W, [pstun(-1, 1), pattack(-1, 1), pstun(-1, 0), pattack(-1, 0), pstun(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.stunning_slice,
        pic: `${IMG_FOLDER.cards}stunning_slice.png`,
        options
    }
}