/** @type {CardGenerator}*/
function maneuver_1(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.maneuver_1,
        pic: `${IMG_FOLDER.cards}maneuver_1.png`,
        options,
        evolutions: [maneuver_2]
    }
}

/** @type {CardGenerator}*/
function maneuver_2(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    return{
        name: card_names.maneuver_2,
        pic: `${IMG_FOLDER.cards}maneuver_2.png`,
        options,
        evolutions: [maneuver_3]
    }
}

/** @type {CardGenerator}*/
function maneuver_3(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.add_button(N, [pmove(0, -2)]);
    options.add_button(E, [pmove(2, 0)]);
    options.add_button(S, [pmove(0, 2)]);
    options.add_button(W, [pmove(-2, 0)]);
    var spin = [
        pstun(1, 1),
        pstun(1, 0),
        pstun(1, -1),
        pstun(0, 1),
        pstun(0, -1),
        pstun(-1, 1),
        pstun(-1, 0),
        pstun(-1, -1),
    ];
    options.add_button(C, spin);
    return{
        name: card_names.maneuver_3,
        pic: `${IMG_FOLDER.cards}maneuver_3.png`,
        options
    }
}