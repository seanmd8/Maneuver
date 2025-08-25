
/** @type {CardGenerator} Dropped by the forest heart*/
function branch_strike(){
    var options = new ButtonGrid();
    var targets = get_2_away().map(p => {
        return pattack(p.x, p.y);
    });
    options.add_button(SPIN, targets);
    return{
        name: card_names.branch_strike,
        pic: `${IMG_FOLDER.cards}branch_strike.png`,
        options
    }
}