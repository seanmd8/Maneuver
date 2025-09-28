/** @type {CardGenerator}*/
function diamond_attack(){
    var options = new ButtonGrid();
    options.add_button(SPIN, [pattack(0, -1), pattack(1, 0), pattack(0, 1), pattack(-1, 0)]);
    options.add_button(SE, [pmove(2, 1)]);
    options.add_button(SW, [pmove(-2, 1)]);
    return{
        name: card_names.diamond_attack,
        pic: `${IMG_FOLDER.cards}diamond_attack.png`,
        options
    }
}