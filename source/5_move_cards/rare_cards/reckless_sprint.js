
/** @type {CardGenerator}*/
function reckless_sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pstun(0, 0), pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pstun(0, 0), pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pstun(0, 0), pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pstun(0, 0), pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.reckless_sprint,
        pic: `${IMG_FOLDER.cards}reckless_sprint.png`,
        options
    }
}