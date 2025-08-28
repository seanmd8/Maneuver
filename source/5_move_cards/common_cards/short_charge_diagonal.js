
/** @type {CardGenerator}*/
function short_charge_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1)]);
    options.add_button(SE, [pmove(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pmove(-1, 1), pattack(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.short_charge_diagonal,
        pic: `${IMG_FOLDER.cards}short_charge_diagonal.png`,
        options
    }
}