/** @type {CardGenerator}*/
function thwack(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1), pattack(0, -1)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 1), pattack(0, 1)]);
    return{
        name: card_names.thwack,
        pic: `${IMG_FOLDER.cards}thwack.png`,
        options
    }
}