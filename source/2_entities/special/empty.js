/** @type {TileGenerator} Empty space.*/
function empty_tile(){
    return {
        type: entity_types.empty,
        name: special_tile_names.empty,
        pic: `${IMG_FOLDER.tiles}empty.png`,
        description: special_tile_descriptions.empty,
        tags: new TagList([TAGS.unmovable])
    }
}