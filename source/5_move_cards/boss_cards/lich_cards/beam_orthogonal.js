
/** @type {CardGenerator} Dropped by the lich*/
function beam_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pattack_until(0, -1)]);
    options.add_button(E, [pattack_until(1, 0)]);
    options.add_button(S, [pattack_until(0, 1)]);
    options.add_button(W, [pattack_until(-1, 0)]);
    return{
        name: `beam orthogonal`,
        pic: `${IMG_FOLDER.cards}beam_orthogonal.png`,
        options
    }
}