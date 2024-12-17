// ----------------lich_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the lich.

/** @type {CardGenerator} Dropped by the lich*/
function instant_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    options.make_instant();
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

/** @type {CardGenerator} Dropped by the lich*/
function beam_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack_until(0, -1)]);
    options.add_button(E, [pattack_until(1, 0)]);
    options.add_button(S, [pattack_until(0, 1)]);
    options.add_button(W, [pattack_until(-1, 0)]);
    return{
        name: `beam orthogonal`,
        pic: `${IMG_FOLDER.cards}beam_orthogonal.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the lich*/
function beam_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack_until(1, -1)]);
    options.add_button(SE, [pattack_until(1, 1)]);
    options.add_button(SW, [pattack_until(-1, 1)]);
    options.add_button(NW, [pattack_until(-1, -1)]);
    return{
        name: `beam diagonal`,
        pic: `${IMG_FOLDER.cards}beam_diagonal.png`,
        options
    }
}
