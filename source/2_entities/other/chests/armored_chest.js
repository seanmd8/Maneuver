/** @type {TileGenerator} Like the normal chest, but it is invulnerable.*/
function armored_chest_tile(){
    return {
        type: `chest`,
        name: `Armored Chest`,
        pic: `${IMG_FOLDER.tiles}armored_chest.png`,
        description: armored_chest_description,
        tags: new TagList([TAGS.unmovable]),
        on_enter: chest_on_enter,
        contents: []
    }
}

