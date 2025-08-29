/** @type {CardGenerator} Dropped by the forest heart*/
function snack(){
    var options = new ButtonGrid();
    options.add_button(C, [pheal(0, 0), pstun(0, 0)]);
    options.make_instant();
    return{
        name: card_names.snack,
        pic: `${IMG_FOLDER.cards}snack.png`,
        options,
        per_floor: snack
    }
}