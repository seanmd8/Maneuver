/** @type {CardGenerator} shown in run history when a card cannot be found.*/
function symbol_card_info_missing(name){
    return{
        name: name,
        pic: `${IMG_FOLDER.ui}card_info_missing.png`,
        options: new ButtonGrid(),
        description: move_types.missing,
    }
}