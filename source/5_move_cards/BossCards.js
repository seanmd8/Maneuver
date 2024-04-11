// ----------------BossCards.js----------------
// File containing cards that can be dropped as rewards for defeating bosses.

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
/** @type {CardGenerator} Dropped by the spider queen*/
function bite(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pinstant(0, 0)]);
    options.add_button(E, [pattack(1, 0), pinstant(0, 0)]);
    options.add_button(S, [pattack(0, 1), pinstant(0, 0)]);
    options.add_button(W, [pattack(-1, 0), pinstant(0, 0)]);
    options.add_button(NE, [pattack(1, -1), pinstant(0, 0)]);
    options.add_button(SE, [pattack(1, 1), pinstant(0, 0)]);
    options.add_button(SW, [pattack(-1, 1), pinstant(0, 0)]);
    options.add_button(NW, [pattack(-1, -1), pinstant(0, 0)]);
    return{
        name: `bite`,
        pic: `${IMG_FOLDER.cards}bite.png`,
        options
    }
}
/** @type {CardGenerator} Dropped by the spider queen*/
function skitter(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.add_button(E, [pmove(1, 0)]);
    options.add_button(S, [pmove(0, 1)]);
    options.add_button(W, [pmove(-1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    options.add_button(SE, [pmove(1, 1)]);
    options.add_button(SW, [pmove(-1, 1)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `skitter`,
        pic: `${IMG_FOLDER.cards}skitter.png`,
        options
    }
}
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