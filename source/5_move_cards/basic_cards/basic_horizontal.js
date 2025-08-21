
/** @type {CardGenerator}*/
function basic_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `basic horizontal`,
        pic: `${IMG_FOLDER.cards}basic_horizontal.png`,
        options,
        basic: true
    }
}