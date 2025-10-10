/** @type {CardGenerator}*/
function spin_attack(){
    var options = new ButtonGrid();
    var spin = ALL_DIRECTIONS.map(p => pattack(p.x, p.y));
    options.add_button(C, spin);
    return{
        name: card_names.spin_attack,
        pic: `${IMG_FOLDER.cards}spin_attack.png`,
        options
    }
}