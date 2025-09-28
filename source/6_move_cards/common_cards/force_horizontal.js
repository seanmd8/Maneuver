/** @type {CardGenerator}*/
function force_horizontal(){
    var options = new ButtonGrid();
    options.add_button(E, [pattack(1, 0), pmove(1, 0), pattack(1, 0), pmove(1, 0)]);
    options.add_button(W, [pattack(-1, 0), pmove(-1, 0), pattack(-1, 0), pmove(-1, 0)]);
    return{
        name: card_names.force_horizontal,
        pic: `${IMG_FOLDER.cards}force_horizontal.png`,
        options
    }
}