/** @type {CardGenerator}*/
function t_strike_horizontal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(2, 0), pattack(1, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-2, 0), pattack(-1, -1)]);
    return{
        name: card_names.t_strike_horizontal,
        pic: `${IMG_FOLDER.cards}t_strike_horizontal.png`,
        options
    }
}