/** @type {TileGenerator} A sturdy wall.*/
function wall_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.wall,
        pic: `${IMG_FOLDER.tiles}wall.png`,
        description: other_tile_descriptions.wall,
        tags: new TagList([TAGS.unmovable]),
    }
}