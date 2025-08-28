
/** @type {CardGenerator}*/
function jab_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -2), pattack(0, -1), pattack(0, -2)]);
    options.add_button(E, [pattack(1, 0), pattack(2, 0), pattack(1, 0), pattack(2, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 2), pattack(0, 1), pattack(0, 2)]);
    options.add_button(W, [pattack(-1, 0), pattack(-2, 0), pattack(-1, 0), pattack(-2, 0)]);
    return{
        name: card_names.jab_orthogonal,
        pic: `${IMG_FOLDER.cards}jab_orthogonal.png`,
        options
    }
}