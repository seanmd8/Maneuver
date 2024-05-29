// ----------------lich_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the lich.

/** @type {CardGenerator} Dropped by the lich*/
function instant_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0), pinstant(0, 0)]);
    return{
        name: `instant teleport`,
        pic: `${IMG_FOLDER.cards}instant_teleport.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the lich*/
function debilitating_confusion(){
    var options = new ButtonGrid();
    var spin = [pstun(1, 1),
                pstun(1, 0),
                pstun(1, -1),
                pstun(0, 1),
                pstun(0, -1),
                pstun(-1, 1),
                pstun(-1, 0),
                pstun(-1, -1)];
    options.add_button(SPIN, spin.concat(spin));
    return{
        name: `debilitating confusion`,
        pic: `${IMG_FOLDER.cards}debilitating_confusion.png`,
        options
    }
}