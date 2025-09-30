/** @type {TileGenerator} */
function thorn_bramble_tile(){
    return{
        type: entity_types.terrain,
        name: other_tile_names.thorn_bramble,
        pic: `${IMG_FOLDER.tiles}thorn_bramble.png`,
        description: other_tile_descriptions.thorn_bramble,
        tags: new TagList([TAGS.unmovable, TAGS.thorn_bush_roots, TAGS.obstruction]),
        health: 1,
        telegraph: hazard_telegraph,
        on_enter: hazard
    }
}