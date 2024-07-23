/** @type {TileGenerator} The player must move here to complete the floor.*/
function exit_tile(){
    return {
        type: `exit`,
        name: `Exit`,
        pic: `${IMG_FOLDER.tiles}stairs.png`,
        description: exit_description,
        tags: new TagList([TAGS.unmovable])
    }
}