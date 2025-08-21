
/** @type {CardGenerator}*/
function alt_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(2, 0), pattack(1, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-2, 0), pattack(-1, -1)]);
    return{
        name: `alternating vertical`,
        pic: `${IMG_FOLDER.cards}alt_vertical.png`,
        options
    }
}