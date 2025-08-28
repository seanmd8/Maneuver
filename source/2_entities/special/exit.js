/** @type {TileGenerator} The player must move here to complete the floor.*/
function exit_tile(){
    return {
        type: entity_types.exit,
        name: special_tile_names.exit,
        pic: `${IMG_FOLDER.tiles}stairs.png`,
        description: special_tile_descriptions.exit,
        tags: new TagList([TAGS.unmovable])
    }
}