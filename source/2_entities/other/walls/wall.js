/** @type {TileGenerator} A sturdy wall.*/
function wall_tile(){
    return {
        type: `terrain`,
        name: `wall`,
        pic: `${IMG_FOLDER.tiles}wall.png`,
        description: wall_description
    }
}