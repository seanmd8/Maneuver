/** @type {CardGenerator}*/
function clear_in_front(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(1, -1), pattack(0, -1), pattack(-1, -1), 
                           pattack(1, -2), pattack(0, -2), pattack(-1, -2)]);
    return{
        name: card_names.clear_in_front,
        pic: `${IMG_FOLDER.cards}clear_in_front.png`,
        options
    }
}