/** @type {TileGenerator}*/
function altar_of_shadow_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_shadow,
        pic: `${IMG_FOLDER.tiles}altar_of_shadow.png`,
        description: other_tile_descriptions.altar_of_shadow,
        tags: new TagList([TAGS.altar]),
        health: 1,
        on_enter: altar_on_enter(altar_of_shadow_on_enter),
    }
}

function altar_of_shadow_on_enter(self, target, map){
    var boss_tile = get_boss(map);
    if(boss_tile !== undefined){
        boss_tile.tags.add(TAGS.hidden);
        boss_tile.look = empty_tile();
    }
}
