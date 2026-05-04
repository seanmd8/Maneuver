/** @type {CardGenerator} */
function repeating_fan(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(1, 0), pstun(-1, 0), pstun(1, -1), pstun(-1, -1), pstun(0, -1), ]);
    options.make_repeating();
    return{
        name: card_names.repeating_fan,
        pic: `${IMG_FOLDER.cards}repeating_fan.png`,
        options
    }
}