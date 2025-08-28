
/** @type {CardGenerator}*/
function basic_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: card_names.basic_orthogonal,
        pic: `${IMG_FOLDER.cards}basic_orthogonal.png`,
        options,
        basic: true
    }
}