/** @type {TileGenerator} Must be unlocked to reveal the exit.*/
function lock_tile(){
    return {
        type: `terrain`,
        name: special_tile_names.lock,
        pic: `${IMG_FOLDER.tiles}lock.png`,
        description: special_tile_descriptions.lock,
        tags: new TagList([TAGS.unmovable])
    }
}