/** @type {CardGenerator} Dropped by the spider queen*/
function bite(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0)]);
    options.add_button(NE, [pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.bite,
        pic: `${IMG_FOLDER.cards}bite.png`,
        options
    }
}