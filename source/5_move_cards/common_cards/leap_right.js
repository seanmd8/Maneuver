
/** @type {CardGenerator}*/
function leap_right(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(SE, [pmove(2, 2)]);
    return{
        name: `leap right`,
        pic: `${IMG_FOLDER.cards}leap_right.png`,
        options
    }
}