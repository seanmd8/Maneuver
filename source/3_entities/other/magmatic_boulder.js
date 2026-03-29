/** @type {TileGenerator} A sturdy wall.*/
function magmatic_boulder_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.magmatic_boulder,
        pic: `${IMG_FOLDER.tiles}magmatic_boulder.png`,
        description: other_tile_descriptions.magmatic_boulder,
        flavor: other_flavor.magmatic_boulder,
        tags: new TagList([TAGS.unmovable]),
        secret_health: 1,
    }
}