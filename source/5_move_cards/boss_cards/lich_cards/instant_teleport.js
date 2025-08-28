
/** @type {CardGenerator} Dropped by the lich*/
function instant_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pteleport(0, 0)]);
    options.make_instant();
    return{
        name: card_names.instant_teleport,
        pic: `${IMG_FOLDER.cards}instant_teleport.png`,
        options
    }
}