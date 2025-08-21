
/** @type {CardGenerator} Dropped by the velociphile*/
function roll_ew(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove_until(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove_until(-1, 0), pattack(-1, 0)]);
    return{
        name: `roll E W`,
        pic: `${IMG_FOLDER.cards}roll_ew.png`,
        options
    }
}