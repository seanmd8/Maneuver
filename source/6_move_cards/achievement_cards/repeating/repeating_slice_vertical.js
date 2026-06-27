
/** @type {CardGenerator} */
function repeating_slice_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1)]);
    options.add_button(S,[pattack(1, 1), pattack(0, 1), pattack(-1, 1)]);
    options.make_repeating();
    return{
        name: card_names.repeating_slice_vertical,
        pic: `${IMG_FOLDER.cards}repeating_slice_vertical.png`,
        options
    }
}