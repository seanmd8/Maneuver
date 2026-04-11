/** @type {CardGenerator} shown in run history when a boon cannot be found.*/
function symbol_boon_info_missing(name){
    return{
        name: name,
        pic: `${IMG_FOLDER.ui}card_info_missing.png`,
        description: boon_descriptions.missing,
    }
}