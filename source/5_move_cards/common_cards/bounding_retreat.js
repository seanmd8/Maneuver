
/** @type {CardGenerator}*/
function bounding_retreat(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(SE, [pmove(2, 2), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2), pmove(-1, 1)]);
    return{
        name: `bounding retreat`,
        pic: `${IMG_FOLDER.cards}bounding_retreat.png`,
        options
    }
}