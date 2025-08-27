/** @type {TileGenerator} */
function small_h_porcuslime_tile(){
    return {
        type: `enemy`,
        name: enemy_names.porcuslime_small,
        pic: `${IMG_FOLDER.tiles}small_h_porcuslime.png`,
        description: enemy_descriptions.porcuslime_small_h,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_horizontal_ai,
        telegraph: porcuslime_horizontal_telegraph,
        }
}