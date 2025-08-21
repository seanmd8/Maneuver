
/** @type {CardGenerator}*/
function stumble_s(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: `stumble south`,
        pic: `${IMG_FOLDER.cards}stumble_s.png`,
        options
    }
}