/** @type {CardGenerator}*/
function lost_maneuver(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: card_names.lost_maneuver,
        pic: `${IMG_FOLDER.cards}lost_maneuver.png`,
        options,
        evolutions: [maneuver_1, blink_1, back_stab_1],
    }
}