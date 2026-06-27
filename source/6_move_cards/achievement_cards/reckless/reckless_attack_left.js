/** @type {CardGenerator}*/
function reckless_attack_left(){
    var options = new ButtonGrid();
    options.add_button(W, [pstun(0, 0), pattack(0, 1), pattack(0, 1), pattack(0, -1), pattack(0, -1),
        pattack(-1, 0), pattack(-1, 0), pattack(-1, 1), pattack(-1, 1), pattack(-1, -1), pattack(-1, -1)]);
    return{
        name: card_names.reckless_attack_left,
        pic: `${IMG_FOLDER.cards}reckless_attack_left.png`,
        options
    }
}