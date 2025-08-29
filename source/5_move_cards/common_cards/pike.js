/** @type {CardGenerator}*/
function pike(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack(0, -2), pattack(1, -3), pattack(0, -3), pattack(-1, -3)]);
    options.add_button(E, [pattack(2, 0), pattack(3, 1), pattack(3, 0), pattack(3, -1)]);
    options.add_button(W, [pattack(-2, 0), pattack(-3, 1), pattack(-3, 0), pattack(-3, -1)]);
    options.add_button(S, [pattack(0, 2), pattack(1, 3), pattack(0, 3), pattack(-1, 3)]);

    return{
        name: card_names.pike,
        pic: `${IMG_FOLDER.cards}pike.png`,
        options
    }
}