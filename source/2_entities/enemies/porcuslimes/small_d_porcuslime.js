/** @type {TileGenerator} */
function small_d_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `Small Porcuslime`,
        pic: `${IMG_FOLDER.tiles}small_d_porcuslime.png`,
        description: small_d_porcuslime_description,
        tags: new TagList(),
        health: 1,
        difficulty: 3,
        behavior: porcuslime_diagonal_ai,
        telegraph: porcuslime_diagonal_telegraph,
    }
}