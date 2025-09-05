/** @type {CardGenerator}*/
function sidestep_e(){
    var options = new ButtonGrid();
    options.add_button(E, [pmove(1, 0)]);
    options.make_instant();
    return{
        name: card_names.sidestep_e,
        pic: `${IMG_FOLDER.cards}sidestep_e.png`,
        options
    }
}