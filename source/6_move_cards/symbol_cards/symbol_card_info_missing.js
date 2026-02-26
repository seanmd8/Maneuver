/** @type {CardGenerator} shown in run history when a card cannot be found.*/
function symbol_card_info_missing(){
    return{
        name: card_names.symbol_card_info_missing,
        pic: `${IMG_FOLDER.ui}card_info_missing.png`,
        options: new ButtonGrid(),
    }
}