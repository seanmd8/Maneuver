
/** @type {CardGenerator}*/
function dash_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pmove(1, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, -0)]);
    return{
        name: card_names.dash_ne,
        pic: `${IMG_FOLDER.cards}dash_ne.png`,
        options
    }
}