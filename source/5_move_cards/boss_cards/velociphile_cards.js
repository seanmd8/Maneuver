// ----------------velociphile_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the velociphile.

/** @type {CardGenerator} Dropped by the velociphile*/
function roll_nesw(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove_until(1, -1), pattack(1, -1)]);
    options.add_button(SW, [pmove_until(-1, 1), pattack(-1, 1)]);
    return{
        name: `roll NE SW`,
        pic: `${IMG_FOLDER.cards}roll_nesw.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the velociphile*/
function roll_nwse(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove_until(1, 1), pattack(1, 1)]);
    options.add_button(NW, [pmove_until(-1, -1), pattack(-1, -1)]);
    return{
        name: `roll NW SE`,
        pic: `${IMG_FOLDER.cards}roll_nwse.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the velociphile*/
function roll_ew(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove_until(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove_until(-1, 0), pattack(-1, 0)]);
    return{
        name: `roll E W`,
        pic: `${IMG_FOLDER.cards}roll_ew.png`,
        options
    }
}