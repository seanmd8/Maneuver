/** @type {TileGenerator} */
function moon_rock_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.moon_rock,
        pic: `${IMG_FOLDER.tiles}moon_rock.png`,
        description: other_tile_descriptions.moon_rock,
        tags: new TagList([TAGS.obstruction]),
        health: 1,
    }
}