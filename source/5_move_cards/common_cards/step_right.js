
/** @type {CardGenerator}*/
function step_right(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(W, [pmove(-2, 0)]);
    return{
        name: `step right`,
        pic: `${IMG_FOLDER.cards}step_right.png`,
        options
    }
}