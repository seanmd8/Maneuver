
/** @type {CardGenerator}*/
function punch_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.punch_diagonal,
        pic: `${IMG_FOLDER.cards}punch_diagonal.png`,
        options
    }
}