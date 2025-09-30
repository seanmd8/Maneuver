/** @type {TileGenerator}*/
function altar_of_stars_tile(){
    var summons = [
        carrion_flies_tile,
        shatter_sphere_d_tile,
        shatter_sphere_o_tile,
        moon_rock_tile,
    ];
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_stars,
        pic: `${IMG_FOLDER.tiles}altar_of_stars.png`,
        description: other_tile_descriptions.altar_of_stars,
        tags: new TagList([TAGS.altar, TAGS.obstruction]),
        health: 1,
        on_enter: altar_on_enter(altar_of_stars_on_enter),
        summons
    }
}

function altar_of_stars_on_enter(self, target, map){
    var mark = {
        pic: `${IMG_FOLDER.tiles}starcaller_rift.png`,
        description: event_descriptions.starfall,
        telegraph: hazard_telegraph
    }
    var fall = function(location){
        return function(map_to_use){
            map_to_use.attack(location);
            if(map_to_use.check_empty(location)){
                map_to_use.add_tile(rand_from(self.tile.summons)(), location);
            }
        }
    }
    var delay = (map_to_use) => {
        var destination = map_to_use.get_player_location();
        if(GS.boons.has(boon_names.manic_presence) && chance(1, 2)){
            var miss = get_nearest_where(map, destination, (t, p) => {
                return t.type === entity_types.enemy && !point_equals(p, self.location);
            });
            destination = miss ? miss : destination;
        }
        map_to_use.mark_event(destination, mark);
        map_to_use.add_event({name: event_names.starfall, behavior: fall(destination)});
    }
    for(var i = 0; i < 3; ++i){
        map.add_event({name: event_names.starfall, behavior: delay_event(i + 1, delay)});
    }
}