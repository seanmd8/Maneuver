
/** @type {CardGenerator}*/
function overcome_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 1), pattack(1, 0), pattack(1, -1), pmove(2, 0)]);
    options.add_button(W, [pattack(-1, 1), pattack(-1, 0), pattack(-1, -1), pmove(-2, 0)]);
    return{
        name: card_names.overcome_horizontal,
        pic: `${IMG_FOLDER.cards}overcome_horizontal.png`,
        options
    }
}