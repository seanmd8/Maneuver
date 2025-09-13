/** @type {CardGenerator}*/
function trample(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -2), pmove(1, -2)]);
    options.add_button(NW, [pattack(-1, -2), pmove(-1, -2)]);
    options.add_button(S, [pattack(0, 2), pmove(0, 2)]);
    return{
        name: card_names.trample,
        pic: `${IMG_FOLDER.cards}trample.png`,
        options
    }
}