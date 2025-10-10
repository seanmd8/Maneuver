/** @type {CardGenerator} Dropped by the forest heart*/
function branch_strike(){
    var options = new ButtonGrid();
    var targets = point_rectangle(new Point(-2, -2), new Point(2, 2)).map(p => {
        return pattack(p.x, p.y);
    });
    options.add_button(C, targets);
    return{
        name: card_names.branch_strike,
        pic: `${IMG_FOLDER.cards}branch_strike.png`,
        options
    }
}