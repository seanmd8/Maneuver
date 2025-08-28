/** @type {SpellGenerator} */
function forest_heart_rest_spell_generator(){
    return {
        behavior: rest_spell,
        telegraph_other: rest_spell_telegraph,
        description: heart_spell_descriptions.rest,
        pic: `${IMG_FOLDER.tiles}forest_heart.png`
    }
}