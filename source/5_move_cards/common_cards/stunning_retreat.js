
/** @type {CardGenerator}*/
function stunning_retreat(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, -1), pstun(1, -1), pstun(-1, -1), pstun(1, 0), pstun(-1, 0),]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: card_names.stunning_retreat,
        pic: `${IMG_FOLDER.cards}stunning_retreat.png`,
        options
    }
}