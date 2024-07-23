/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: `terrain`,
        name: `Lava Pool`,
        pic: `${IMG_FOLDER.tiles}lava_pool.png`,
        description: lava_pool_description,
        tags: new TagList([TAGS.unmovable]),
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}
