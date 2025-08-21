
/** @type {CardGenerator} Dropped by the spider queen*/
function chomp(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -1), pattack(0, -1)]);
    options.add_button(E, [pattack(1, 0), pattack(1, 0)]);
    options.add_button(S, [pattack(0, 1), pattack(0, 1)]);
    options.add_button(W, [pattack(-1, 0), pattack(-1, 0)]);
    options.add_button(NE, [pattack(1, -1), pattack(1, -1)]);
    options.add_button(SE, [pattack(1, 1), pattack(1, 1)]);
    options.add_button(SW, [pattack(-1, 1), pattack(-1, 1)]);
    options.add_button(NW, [pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: `chomp`,
        pic: `${IMG_FOLDER.cards}chomp.png`,
        options
    }
}