/** @type {CardGenerator} Dropped by the velociphile*/
function roll_ne(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove_until(1, -1), pattack(1, -1)]);
    options.add_button(SW, [pmove_until(-1, 1), pattack(-1, 1)]);
    return{
        name: card_names.roll_ne,
        pic: `${IMG_FOLDER.cards}roll_ne.png`,
        options
    }
}