/** @type {CardGenerator}*/
function reckless_spin(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(C, [pstun(0, 0), pstun(0, 0), ...spin, ...spin]);
    return{
        name: card_names.reckless_spin,
        pic: `${IMG_FOLDER.cards}reckless_spin.png`,
        options
    }
}