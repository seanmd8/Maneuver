/** @type {CardGenerator}*/
function y_strike_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, 0), pattack(1, -1), pattack(2, -2), pattack(0, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pattack(-1, 0), pattack(-1, 1), pattack(-2, 2), pattack(0, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: card_names.y_strike_ne,
        pic: `${IMG_FOLDER.cards}y_strike_ne.png`,
        options
    }
}