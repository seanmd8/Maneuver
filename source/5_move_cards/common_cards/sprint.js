
/** @type {CardGenerator}*/
function sprint(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pmove(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pmove(0, 1)]);
    return{
        name: `sprint`,
        pic: `${IMG_FOLDER.cards}sprint.png`,
        options
    }
}