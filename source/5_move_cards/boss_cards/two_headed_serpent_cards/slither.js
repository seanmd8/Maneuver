
/** @type {CardGenerator} Dropped by the two headed serpent.*/
function slither(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pmove(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pmove(-1, 0), pmove(-1, 0)]);
    options.make_instant();
    return{
        name: `slither`,
        pic: `${IMG_FOLDER.cards}slither.png`,
        options
    }
}