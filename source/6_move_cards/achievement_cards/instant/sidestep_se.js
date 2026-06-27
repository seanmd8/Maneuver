/** @type {CardGenerator}*/
function sidestep_se(){
    var options = new ButtonGrid();
    options.add_button(SE, [pmove(1, 1)]);
    options.make_instant();
    return{
        name: card_names.sidestep_se,
        pic: `${IMG_FOLDER.cards}sidestep_se.png`,
        options
    }
}