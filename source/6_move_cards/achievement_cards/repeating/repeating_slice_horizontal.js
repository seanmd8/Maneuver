
/** @type {CardGenerator} */
function repeating_slice_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1)]);
    options.make_repeating();
    return{
        name: card_names.repeating_slice_horizontal,
        pic: `${IMG_FOLDER.cards}repeating_slice_horizontal.png`,
        options
    }
}