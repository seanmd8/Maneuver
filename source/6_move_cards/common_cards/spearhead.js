/** @type {CardGenerator}*/
function spearhead(){
    var options = new ButtonGrid();
    options.add_button(NE, [pmove(1, -1), pattack(1, -1), pattack(1, 0), pattack(0, -1)]);
    options.add_button(NW, [pmove(-1, -1), pattack(-1, -1), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1)]);
    return{
        name: card_names.spearhead,
        pic: `${IMG_FOLDER.cards}spearhead.png`,
        options
    }
}