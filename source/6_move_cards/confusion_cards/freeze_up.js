/** @type {CardGenerator}*/
function freeze_up(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: card_names.freeze_up,
        pic: `${IMG_FOLDER.cards}freeze_up.png`,
        options
    }
}