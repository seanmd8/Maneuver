// ----------------two_headed_serpent_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the two headed serpent.

/** @type {CardGenerator} Dropped by the two headed serpent*/
function regenerate(){
    var options = new ButtonGrid();
    options.add_button(C, [pheal(0, 0)]);
    return{
        name: `regenerate`,
        pic: `${IMG_FOLDER.cards}regenerate.png`,
        options,
        per_floor: regenerate
    }
}

/** @type {CardGenerator} Dropped by the two headed serpent*/
function fangs(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(E, [pmove(1, 0), pattack(1, 0), pattack(0, 1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    options.add_button(W, [pmove(-1, 0), pattack(-1, 0), pattack(0, 1), pattack(0, -1)]);
    return{
        name: `fangs`,
        pic: `${IMG_FOLDER.cards}fangs.png`,
        options
    }
}