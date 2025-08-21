
/** @type {CardGenerator}*/
function slip_through_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pattack(0, 1), pattack(1, 0), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pattack(0, -1), pattack(-1, 0), pmove(-1, -1)]);
    return{
        name: `slip through ne`,
        pic: `${IMG_FOLDER.cards}slip_through_ne.png`,
        options
    }
}