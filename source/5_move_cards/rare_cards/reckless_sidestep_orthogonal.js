
/** @type {CardGenerator}*/
function reckless_sidestep_orthogonal(){
    var options = new ButtonGrid();
    options.add_button(N, [pstun(0, 0), pmove(0, -1)]);
    options.add_button(E, [pstun(0, 0), pmove(1, 0)]);
    options.add_button(S, [pstun(0, 0), pmove(0, 1)]);
    options.add_button(W, [pstun(0, 0), pmove(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.reckless_sidestep_orthogonal,
        pic: `${IMG_FOLDER.cards}reckless_sidestep_orthogonal.png`,
        options
    }
}