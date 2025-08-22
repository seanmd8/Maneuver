
/** @type {CardGenerator}*/
function side_sprint(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pmove(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pmove(-1, 0)]);
    return{
        name: `side sprint`,
        pic: `${IMG_FOLDER.cards}side_sprint.png`,
        options
    }
}