/** @type {TileGenerator} A chest letting the user choose a reward. Currently empty.*/
function chest_tile(){
    return {
        type: entity_types.chest,
        name: special_tile_names.chest,
        pic: `${IMG_FOLDER.tiles}chest.png`,
        description: special_tile_descriptions.chest,
        tags: new TagList([TAGS.unmovable]),
        health: 1,
        on_enter: chest_on_enter,
        contents: []
    }
}

