
/** @type {CardGenerator}*/
function step_left(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0)]);
    options.add_button(NW, [pmove(-1, -1)]);
    options.add_button(E, [pmove(2, 0)]);
    return{
        name: `step left`,
        pic: `${IMG_FOLDER.cards}step_left.png`,
        options
    }
}