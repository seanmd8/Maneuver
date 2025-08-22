
/** @type {CardGenerator} Dropped by the forest heart*/
function vine_snare(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(2, 2), pmove(1, 1)]);
    options.add_button(SW, [pmove(-2, 2), pmove(-1, 1)]);
    options.add_button(NE, [pmove(2, -2), pmove(1, -1)]);
    options.add_button(NW, [pmove(-2, -2), pmove(-1, -1)]);
    return{
        name: `vine snare`,
        pic: `${IMG_FOLDER.cards}vine_snare.png`,
        options
    }
}