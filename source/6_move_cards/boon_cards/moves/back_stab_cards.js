/** @type {CardGenerator}*/
function back_stab_1(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.back_stab_1,
        pic: `${IMG_FOLDER.cards}back_stab_1.png`,
        options,
        evolutions: [back_stab_2]
    }
}

/** @type {CardGenerator}*/
function back_stab_2(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2), pattack(-1, 1), pattack(-1, 0), pattack(0, 1)]);
    options.add_button(SE, [pmove(2, 2), pattack(-1, -1), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(SW, [pmove(-2, 2), pattack(1, -1), pattack(1, 0), pattack(0, -1)]);
    options.add_button(NW, [pmove(-2, -2), pattack(1, 1), pattack(1, 0), pattack(0, 1)]);
    return{
        name: card_names.back_stab_2,
        pic: `${IMG_FOLDER.cards}back_stab_2.png`,
        options,
    }
}