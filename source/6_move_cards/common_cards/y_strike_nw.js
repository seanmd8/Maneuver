/** @type {CardGenerator}*/
function y_strike_nw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pattack(1, 0), pattack(1, 1), pattack(2, 2), pattack(0, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pattack(-1, 0), pattack(-1, -1), pattack(-2, -2), pattack(0, -1)]);
    return{
        name: card_names.y_strike_nw,
        pic: `${IMG_FOLDER.cards}y_strike_nw.png`,
        options
    }
}