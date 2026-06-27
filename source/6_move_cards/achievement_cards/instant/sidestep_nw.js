/** @type {CardGenerator}*/
function sidestep_nw(){
    var options = new ButtonGrid();
    options.add_button(NW, [pmove(-1, -1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_nw,
        pic: `${IMG_FOLDER.cards}sidestep_nw.png`,
        options
    }
}