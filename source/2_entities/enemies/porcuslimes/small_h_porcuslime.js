/** @type {TileGenerator} */
function small_h_porcuslime_tile(){
    return {
        type: `enemy`,
        name: `small porcuslime`,
        pic: `${IMG_FOLDER.tiles}small_h_porcuslime.png`,
        description: small_h_porcuslime_description,
        health: 1,
        difficulty: 3,
        behavior: porcuslime_horizontal_ai,
        telegraph: porcuslime_horizontal_telegraph,
        }
}