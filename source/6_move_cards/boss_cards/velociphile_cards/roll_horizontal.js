/** @type {CardGenerator} Dropped by the velociphile*/
function roll_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove_until(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove_until(-1, 0), pattack(-1, 0)]);
    return{
        name: card_names.roll_horizontal,
        pic: `${IMG_FOLDER.cards}roll_horizontal.png`,
        options
    }
}