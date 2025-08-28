
/** @type {CardGenerator}*/
function charge_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0), pmove(1, 0), pattack(1, 0)]);
    options.add_button(W, [pmove(-1, 0), pmove(-1, 0), pattack(-1, 0)]);
    return{
        name: card_names.charge_horizontal,
        pic: `${IMG_FOLDER.cards}charge_horizontal.png`,
        options
    }
}