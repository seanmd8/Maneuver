
/** @type {CardGenerator} */
function cycling_dash_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    options.make_cycling();
    return{
        name: card_names.cycling_dash_vertical,
        pic: `${IMG_FOLDER.cards}cycling_dash_vertical.png`,
        options
    }
}