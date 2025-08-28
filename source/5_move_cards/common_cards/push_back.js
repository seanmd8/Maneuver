
/** @type {CardGenerator}*/
function push_back(){
    var options = new ButtonGrid();
    options.add_button(SE, [pattack(-1, -1), pmove(1, 1)]);
    options.add_button(S, [pattack(0, -1), pmove(0, 1)]);
    options.add_button(SW, [pattack(1, -1), pmove(-1, 1)]);
    return{
        name: card_names.push_back,
        pic: `${IMG_FOLDER.cards}push_back.png`,
        options
    }
}