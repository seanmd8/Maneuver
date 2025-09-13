/** @type {CardGenerator}*/
function sidestep_w(){
    var options = new ButtonGrid();
    options.add_button(W, [pmove(-1, 0)]);
    options.make_instant();
    return{
        name: card_names.sidestep_w,
        pic: `${IMG_FOLDER.cards}sidestep_w.png`,
        options
    }
}