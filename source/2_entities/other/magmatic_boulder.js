/** @type {TileGenerator} A sturdy wall.*/
function magmatic_boulder_tile(){
    return {
        type: `terrain`,
        name: `magmatic boulder`,
        pic: `${IMG_FOLDER.tiles}magmatic_boulder.png`,
        description: magmatic_boulder_description,
        tags: new TagList([TAGS.unmovable]),
    }
}