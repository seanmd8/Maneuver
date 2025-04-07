
// ----------------arcane_sentry_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the arcane sentry.

/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack_until(0, -1), pattack_until(1, 0)]);
    options.add_button(SW, [pmove(-1, 1)]);
    return{
        name: `beam ne`,
        pic: `${IMG_FOLDER.cards}beam_ne.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pattack_until(0, -1), pattack_until(-1, 0)]);
    options.add_button(SE, [pmove(1, 1)]);
    return{
        name: `beam nw`,
        pic: `${IMG_FOLDER.cards}beam_nw.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pattack_until(0, 1), pattack_until(1, 0)]);
    options.add_button(NW, [pmove(-1, -1)]);
    return{
        name: `beam se`,
        pic: `${IMG_FOLDER.cards}beam_se.png`,
        options
    }
}

/** @type {CardGenerator} Dropped by the Arcane Sentry*/
function beam_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pattack_until(0, 1), pattack_until(-1, 0)]);
    options.add_button(NE, [pmove(1, -1)]);
    return{
        name: `beam sw`,
        pic: `${IMG_FOLDER.cards}beam_sw.png`,
        options
    }
}

/** @type {CardGenerator}*/
function saw_ns(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), pmove(0, -1)]);
    options.add_button(S, [pattack(0, 1), pattack(1, 0), pattack(0, -1), pattack(-1, 0), pmove(0, 1)]);
    return{
        name: `saw ns`,
        pic: `${IMG_FOLDER.cards}saw_ns.png`,
        options
    }
}

/** @type {CardGenerator}*/
function saw_ew(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 0), pattack(0, 1), pattack(-1, 0), pattack(0, -1), pmove(1, 0)]);
    options.add_button(W, [pattack(-1, 0), pattack(0, 1), pattack(1, 0), pattack(0, -1), pmove(-1, 0)]);
    return{
        name: `saw ew`,
        pic: `${IMG_FOLDER.cards}saw_ew.png`,
        options
    }
}