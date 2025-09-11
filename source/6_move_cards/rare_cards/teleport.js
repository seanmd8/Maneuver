/** @type {CardGenerator}*/
function teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    return{
        name: card_names.teleport,
        pic: `${IMG_FOLDER.cards}teleport.png`,
        options
    }
}