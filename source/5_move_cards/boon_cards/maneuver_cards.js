
/** @type {CardGenerator}*/
function simple_maneuver(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: `simple maneuver`,
        pic: `${IMG_FOLDER.cards}simple_maneuver.png`,
        options,
        evolutions: [medium_maneuver]
    }
}

/** @type {CardGenerator}*/
function medium_maneuver(){
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
        name: `medium maneuver`,
        pic: `${IMG_FOLDER.cards}medium_maneuver.png`,
        options,
        evolutions: [advanced_maneuver]
    }
}

/** @type {CardGenerator}*/
function advanced_maneuver(){
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
        pstun(-1, -1)
    ];
    options.add_button(SPIN, spin);
    return{
        name: `advanced maneuver`,
        pic: `${IMG_FOLDER.cards}advanced_maneuver.png`,
        options
    }
}