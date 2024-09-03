/** @type {TileGenerator} A chest letting the user choose a reward. Currently empty.*/
function chest_tile(){
    return {
        type: `chest`,
        name: `Chest`,
        pic: `${IMG_FOLDER.tiles}chest.png`,
        description: chest_description,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: chest_on_enter,
        contents: []
    }
}

