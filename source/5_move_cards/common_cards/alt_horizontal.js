
/** @type {CardGenerator}*/
function alt_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(0, -2), pattack(-1, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(0, 2), pattack(-1, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: `alternating horizontal`,
        pic: `${IMG_FOLDER.cards}alt_horizontal.png`,
        options
    }
}