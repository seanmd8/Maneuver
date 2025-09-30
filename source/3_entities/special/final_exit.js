/** @type {TileGenerator} The player must move here to complete the game.*/
function final_exit_tile(){
    return {
        type: entity_types.final_exit,
        name: special_tile_names.final_exit,
        pic: `${IMG_FOLDER.tiles}final_exit.png`,
        description: special_tile_descriptions.final_exit,
        tags: new TagList([TAGS.unmovable]),
    }
}