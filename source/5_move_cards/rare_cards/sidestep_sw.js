
/** @type {CardGenerator}*/
function sidestep_sw(){
    var options = new ButtonGrid();
    options.add_button(SW, [pmove(-1, 1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_sw,
        pic: `${IMG_FOLDER.cards}sidestep_sw.png`,
        options
    }
}