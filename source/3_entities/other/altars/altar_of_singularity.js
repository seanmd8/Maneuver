/** @type {TileGenerator}*/
function altar_of_singularity_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_singularity,
        pic: `${IMG_FOLDER.tiles}altar_of_singularity.png`,
        description: other_tile_descriptions.altar_of_singularity,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_singularity_on_enter),
    }
}

function altar_of_singularity_on_enter(self, target, map){
    var fall = function(location){
        return function(map_to_use){
            map_to_use.attack(location);
            if(map_to_use.check_empty(location)){
                map_to_use.add_tile(black_hole_tile(), location);
            }
        }
    }
    var delay = (map_to_use) => {
        var destination = self.location;
        map_to_use.mark_event(destination, black_hole_beginning_mark());
        map_to_use.add_event({name: event_names.black_hole, behavior: fall(destination)});
    }
    // If this is the last altar, wait an extra turn so the lord can summon then move.
    var wait = get_nearest_altar(map, self.location) === undefined ? 2 : 1;
    map.add_event({name: event_names.black_hole, behavior: delay_event(wait, delay)});
}