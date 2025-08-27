/** @type {TileGenerator} */
function small_o_porcuslime_tile(){
    return {
        type: entity_types.enemy,
        name: enemy_names.porcuslime_small,
        pic: `${IMG_FOLDER.tiles}small_o_porcuslime.png`,
        description: enemy_descriptions.porcuslime_small_h,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_horizontal_ai,
        telegraph: porcuslime_horizontal_telegraph,
        }
}