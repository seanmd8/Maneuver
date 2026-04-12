
/** @type {CardGenerator} */
function repeating_spin(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(C, [pstun(0, 0), ...spin, ...spin]);
    options.make_repeating();
    return{
        name: card_names.repeating_spin,
        pic: `${IMG_FOLDER.cards}repeating_spin.png`,
        options
    }
}