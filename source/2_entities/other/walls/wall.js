/** @type {TileGenerator} A sturdy wall.*/
function wall_tile(){
    return {
        type: `terrain`,
        name: `Wall`,
        pic: `${IMG_FOLDER.tiles}wall.png`,
        description: wall_description,
        tags: new TagList([TAGS.unmovable]),
    }
}