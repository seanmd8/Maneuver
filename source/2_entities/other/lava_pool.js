/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: `terrain`,
        name: `lava pool`,
        pic: `${IMG_FOLDER.tiles}lava_pool.png`,
        description: lava_pool_description,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}
