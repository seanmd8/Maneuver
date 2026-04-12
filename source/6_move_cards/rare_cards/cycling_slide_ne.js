
/** @type {CardGenerator} */
function cycling_slide_ne(){
    var options = new ButtonGrid();
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    options.add_button(NE, [pmove(1, -1), pmove(1, -1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.make_cycling();
    return{
        name: card_names.cycling_slide_ne,
        pic: `${IMG_FOLDER.cards}cycling_slide_ne.png`,
        options
    }
}