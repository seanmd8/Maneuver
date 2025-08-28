
/** @type {CardGenerator}*/
function breakthrough_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pattack(1, 0), pattack(-1, 0), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pattack(1, 0), pattack(-1, 0), pattack(0, 1)]);
    return{
        name: card_names.breakthrough_vertical,
        pic: `${IMG_FOLDER.cards}breakthrough_vertical.png`,
        options
    }
}