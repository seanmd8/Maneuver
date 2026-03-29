/** @type {TileGenerator} A hazardous pool of lava.*/
function lava_pool_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.lava_pool,
        pic: `${IMG_FOLDER.tiles}lava_pool.png`,
        description: other_tile_descriptions.lava_pool,
        flavor: other_flavor.lava_pool,
        tags: new TagList([TAGS.unmovable]),
        secret_health: 1,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}