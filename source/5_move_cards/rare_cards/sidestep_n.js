
/** @type {CardGenerator}*/
function sidestep_n(){
    var options = new ButtonGrid();
    options.add_button(N, [pmove(0, -1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_n,
        pic: `${IMG_FOLDER.cards}sidestep_n.png`,
        options
    }
}