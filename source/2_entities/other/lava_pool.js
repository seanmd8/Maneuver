/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.lava_pool,
        pic: `${IMG_FOLDER.tiles}lava_pool.png`,
        description: other_tile_descriptions.lava_pool,
        tags: new TagList([TAGS.unmovable]),
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}