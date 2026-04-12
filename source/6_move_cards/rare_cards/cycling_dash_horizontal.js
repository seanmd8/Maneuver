
/** @type {CardGenerator} */
function cycling_dash_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0), pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0)]);
    options.make_cycling();
    return{
        name: card_names.cycling_dash_horizontal,
        pic: `${IMG_FOLDER.cards}cycling_dash_horizontal.png`,
        options
    }
}