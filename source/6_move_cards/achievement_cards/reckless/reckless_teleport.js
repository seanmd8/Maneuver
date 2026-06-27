/** @type {CardGenerator}*/
function reckless_teleport(){
    var options = new ButtonGrid();
    options.add_button(C, [pstun(0, 0), pstun(0, 0), pteleport(0, 0)]);
    options.make_instant();
    return{
        name: card_names.reckless_teleport,
        pic: `${IMG_FOLDER.cards}reckless_teleport.png`,
        options
    }
}