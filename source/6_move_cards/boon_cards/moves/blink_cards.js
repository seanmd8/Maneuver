/** @type {CardGenerator}*/
function blink_1(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    return{
        name: card_names.blink_1,
        pic: `${IMG_FOLDER.cards}blink_1.png`,
        options,
        evolutions: [blink_2]
    }
}

/** @type {CardGenerator}*/
function blink_2(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(2, -2)]);
    options.add_button(SE, [pmove(2, 2)]);
    options.add_button(SW, [pmove(-2, 2)]);
    options.add_button(NW, [pmove(-2, -2)]);
    options.make_instant();
    return{
        name: card_names.blink_2,
        pic: `${IMG_FOLDER.cards}blink_2.png`,
        options,
    }
}