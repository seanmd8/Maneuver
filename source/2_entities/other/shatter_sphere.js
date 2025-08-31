/** @type {TileGenerator} */
function shatter_sphere_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.shatter_sphere,
        pic: `${IMG_FOLDER.tiles}shatter_sphere.png`,
        description: other_tile_descriptions.shatter_sphere,
        tags: new TagList(),
        health: 1,
        telegraph_other: spider_telegraph,
        on_death: acid_bug_death,
    }
}
