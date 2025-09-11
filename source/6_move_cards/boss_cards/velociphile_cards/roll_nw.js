/** @type {CardGenerator} Dropped by the velociphile*/
function roll_nw(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove_until(1, 1), pattack(1, 1)]);
    options.add_button(NW, [pmove_until(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.roll_nw,
        pic: `${IMG_FOLDER.cards}roll_nw.png`,
        options
    }
}