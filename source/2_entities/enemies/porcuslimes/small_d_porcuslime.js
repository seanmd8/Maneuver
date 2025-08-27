/** @type {TileGenerator} */
function small_d_porcuslime_tile(){
    return {
        type: `enemy`,
        name: enemy_names.porcuslime_small,
        pic: `${IMG_FOLDER.tiles}small_d_porcuslime.png`,
        description: enemy_descriptions.porcuslime_small_d,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_diagonal_ai,
        telegraph: porcuslime_diagonal_telegraph,
    }
}