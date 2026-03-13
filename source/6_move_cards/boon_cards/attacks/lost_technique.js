/** @type {CardGenerator}*/
function lost_technique(){
    var options = new ButtonGrid();
    options.add_button(C, [], 5);
    return{
        name: card_names.lost_technique,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        options,
        evolutions: [split_second_1, execution_1, superweapon_1]
    }
}