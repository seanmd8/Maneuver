/** @type {TileGenerator} Empty space.*/
function empty_tile(){
    return {
        type: `empty`,
        name: `empty`,
        pic: `${IMG_FOLDER.tiles}empty.png`,
        description: empty_description,
        tags: new TagList([TAGS.unmovable])
    }
}