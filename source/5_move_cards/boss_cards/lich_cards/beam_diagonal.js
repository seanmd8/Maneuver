
/** @type {CardGenerator} Dropped by the lich*/
function beam_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pattack_until(1, -1)]);
    options.add_button(SE, [pattack_until(1, 1)]);
    options.add_button(SW, [pattack_until(-1, 1)]);
    options.add_button(NW, [pattack_until(-1, -1)]);
    return{
        name: card_names.beam_diagonal,
        pic: `${IMG_FOLDER.cards}beam_diagonal.png`,
        options
    }
}