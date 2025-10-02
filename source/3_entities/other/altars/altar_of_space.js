/** @type {TileGenerator}*/
function altar_of_space_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_space,
        pic: `${IMG_FOLDER.tiles}altar_of_space.png`,
        description: other_tile_descriptions.altar_of_space,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_space_on_enter),
    }
}

function altar_of_space_on_enter(self, target, map){
    var warp = (map_to_use) => {
        var to_move = [];
        cross(range(0, FLOOR_WIDTH), range(0, FLOOR_HEIGHT), (x, y) => {
            to_move.push(new Point(x, y));
        });
        to_move = to_move.filter((p) => {
            return !map_to_use.get_tile(p).tags.has(TAGS.unmovable);
        });
        for(var p of to_move){
            teleport_spell({location: p}, undefined, map_to_use);
        }
    }
    map.add_event({name: event_names.warp , behavior: warp});
}