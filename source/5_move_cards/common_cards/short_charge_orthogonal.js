
/** @type {CardGenerator}*/
function short_charge_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0)]);
    options.add_button(S, [pmove(0, 1), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: card_names.short_charge_orthogonal,
        pic: `${IMG_FOLDER.cards}short_charge_orthogonal.png`,
        options
    }
}