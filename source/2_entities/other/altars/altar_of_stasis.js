/** @type {TileGenerator}*/
function altar_of_stasis_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_stasis,
        pic: `${IMG_FOLDER.tiles}altar_of_stasis.png`,
        description: other_tile_descriptions.altar_of_stasis,
        tags: new TagList([TAGS.altar]),
        health: 1,
        on_enter: altar_on_enter(altar_of_stasis_on_enter)
    }
}

function altar_of_stasis_on_enter(self, target, map){
    cross(range(0, FLOOR_WIDTH), range(0, FLOOR_HEIGHT), (x, y) => {
        var space = new Point(x, y);
        var tile = map.get_tile(space);
        if(tile.tags.has(TAGS.boss)){
            map.heal(space, 2)
        }
        if(tile.tags.has(TAGS.altar)){
            map.heal(space, 1);
        }
    })
}