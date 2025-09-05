/** @type {CardGenerator}*/
function charge_vertical(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1), pmove(0, -1), pattack(0, -1)]);
    options.add_button(S, [pmove(0, 1), pmove(0, 1), pattack(0, 1)]);
    return{
        name: card_names.charge_vertical,
        pic: `${IMG_FOLDER.cards}charge_vertical.png`,
        options
    }
}