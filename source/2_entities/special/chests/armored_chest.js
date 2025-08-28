/** @type {TileGenerator} Like the normal chest, but it is invulnerable.*/
function armored_chest_tile(){
    return {
        type: entity_types.chest,
        name: special_tile_names.chest_armored,
        pic: `${IMG_FOLDER.tiles}armored_chest.png`,
        description: special_tile_descriptions.chest_armored,
        tags: new TagList([TAGS.unmovable]),
        on_enter: chest_on_enter,
        contents: []
    }
}

