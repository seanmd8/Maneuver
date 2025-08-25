
/** @type {CardGenerator}*/
function punch_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.punch_orthogonal,
        pic: `${IMG_FOLDER.cards}punch_orthogonal.png`,
        options
    }
}