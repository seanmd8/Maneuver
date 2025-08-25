
/** @type {CardGenerator}*/
function advance(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1)]);
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1)]);
    return{
        name: card_names.advance,
        pic: `${IMG_FOLDER.cards}advance.png`,
        options
    }
}