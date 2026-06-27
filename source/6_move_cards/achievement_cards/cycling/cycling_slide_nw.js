
/** @type {CardGenerator} */
function cycling_slide_nw(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(NW, [pmove(-1, -1), pmove(-1, -1)]);
    options.make_cycling();
    return{
        name: card_names.cycling_slide_nw,
        pic: `${IMG_FOLDER.cards}cycling_slide_nw.png`,
        options
    }
}