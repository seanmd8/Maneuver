/** @type {CardGenerator}*/
function stunning_punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(1, -1), pstun(1, -1)]);
    options.add_button(SE, [pstun(1, 1), pstun(1, 1)]);
    options.add_button(SW, [pstun(-1, 1), pstun(-1, 1)]);
    options.add_button(NW, [pstun(-1, -1), pstun(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.stunning_punch_diagonal,
        pic: `${IMG_FOLDER.cards}stunning_punch_diagonal.png`,
        options
    }
}