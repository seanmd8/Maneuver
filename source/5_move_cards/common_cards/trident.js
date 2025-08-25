
/** @type {CardGenerator}*/
function trident(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    options.add_button(E, [pattack(2, 1), pattack(2, 0), pattack(2, -1)]);
    options.add_button(W, [pattack(-2, 1), pattack(-2, 0), pattack(-2, -1)]);
    options.add_button(S, [pattack(1, 2), pattack(0, 2), pattack(-1, 2)]);
    return{
        name: card_names.trident,
        pic: `${IMG_FOLDER.cards}trident.png`,
        options
    }
}