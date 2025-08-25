
/** @type {CardGenerator}*/
function overcome_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), pmove(0, -2)]);
    options.add_button(S, [pattack(1, 1), pattack(0, 1), pattack(-1, 1), pmove(0, 2)]);
    return{
        name: card_names.overcome_vertical,
        pic: `${IMG_FOLDER.cards}overcome_vertical.png`,
        options
    }
}