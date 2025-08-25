
/** @type {CardGenerator}*/
function glide(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -1)]);
    options.add_button(E, [pmove(3, 0)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(NW, [pmove(-2, -1)]);
    options.add_button(W, [pmove(-3, 0)]);
    options.add_button(SW, [pmove(-2, 1)]);
    return{
        name: card_names.glide,
        pic: `${IMG_FOLDER.cards}glide.png`,
        options
    }
}