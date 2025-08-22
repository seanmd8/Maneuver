
/** @type {CardGenerator}*/
function saw_strike(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    options.add_button(SE, [pmove(1, 1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    options.add_button(NW, [pmove(-1, -1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    options.add_button(SW, [pmove(-1, 1), pattack(0, -1), pattack(-1, 0), pattack(0, 1), pattack(1, 0), ]);
    return{
        name: `saw strike`,
        pic: `${IMG_FOLDER.cards}saw_strike.png`,
        options
    }
}