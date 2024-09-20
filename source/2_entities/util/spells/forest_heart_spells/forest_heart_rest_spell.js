/** @type {SpellGenerator} */
function forest_heart_rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph_other: rest_spell_telegraph,
        description: forest_heart_rest_description,
        pic: `${IMG_FOLDER.tiles}forest_heart.png`
    }
}