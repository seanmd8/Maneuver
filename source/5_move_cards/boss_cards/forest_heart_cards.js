// ----------------two_headed_serpent_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the forest heart.

/** @type {CardGenerator} Dropped by the forest heart*/
function snack(){
    var options = new ButtonGrid();
    options.add_button(C, [pheal(0, 0), pstun(0, 0)]);
    options.make_instant();
    return{
        name: `snack`,
        pic: `${IMG_FOLDER.cards}snack.png`,
        options,
        per_floor: snack
    }
}

/** @type {CardGenerator} Dropped by the forest heart*/
function branch_strike(){
    var options = new ButtonGrid();
    var targets = get_2_away().map(p => {
        return pattack(p.x, p.y);
    });
    options.add_button(SPIN, targets);
    return{
        name: `branch strike`,
        pic: `${IMG_FOLDER.cards}branch_strike.png`,
        options
    }
}