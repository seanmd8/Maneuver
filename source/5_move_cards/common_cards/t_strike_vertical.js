
/** @type {CardGenerator}*/
function t_strike_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(0, -2), pattack(-1, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(0, 2), pattack(-1, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    return{
        name: card_names.t_strike_vertical,
        pic: `${IMG_FOLDER.cards}t_strike_vertical.png`,
        options
    }
}