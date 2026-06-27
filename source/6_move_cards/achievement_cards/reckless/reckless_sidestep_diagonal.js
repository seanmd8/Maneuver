/** @type {CardGenerator}*/
function reckless_sidestep_diagonal(){
    var options = new ButtonGrid();
    options.add_button(NE, [pstun(0, 0), pmove(1, -1)]);
    options.add_button(SE, [pstun(0, 0), pmove(1, 1)]);
    options.add_button(SW, [pstun(0, 0), pmove(-1, 1)]);
    options.add_button(NW, [pstun(0, 0), pmove(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.reckless_sidestep_diagonal,
        pic: `${IMG_FOLDER.cards}reckless_sidestep_diagonal.png`,
        options
    }
}