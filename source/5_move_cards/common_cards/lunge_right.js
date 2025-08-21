
/** @type {CardGenerator}*/
function lunge_right(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1), pmove(-1, 1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1), pattack(1, -1)]);
    return{
        name: `lunge right`,
        pic: `${IMG_FOLDER.cards}lunge_right.png`,
        options
    }
}