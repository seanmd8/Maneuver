// ----------------spider_queen_cards.js----------------
// File containing cards that can be dropped as rewards for defeating the spider queen.

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