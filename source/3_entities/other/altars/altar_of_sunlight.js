/** @type {TileGenerator}*/
function altar_of_sunlight_tile(){
    return {
        type: entity_types.terrain,
        name: other_tile_names.altar_of_sunlight,
        pic: `${IMG_FOLDER.tiles}altar_of_sunlight.png`,
        description: other_tile_descriptions.altar_of_sunlight,
        tags: new TagList([TAGS.altar]),
        health: 1,
        on_enter: altar_on_enter(altar_of_sunlight_on_enter)
    }
}

function altar_of_sunlight_on_enter(self, target, map){
    var mark = {
        pic: `${IMG_FOLDER.tiles}sunlight.png`,
        description: event_descriptions.sunlight,
        telegraph: hazard_telegraph
    }
    var fire = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
                if(map_to_use.check_empty(location)){
                    map_to_use.add_tile(raging_fire_tile(), location);
                }
            }
        }
    }
    var delay = (points) => {
        return (map_to_use) => {
            for(var point of points){
                map_to_use.mark_event(point, mark);
            }
            map_to_use.add_event({name: other_tile_names.raging_fire, behavior: fire(points)});
        }
    } 
    var target = map.get_player_location();
    for(var i = 0; i < 3; ++i){
        var rectangle = point_rectangle(target.plus(new Point(i, i)), target.plus(new Point(-i, -i)));
        var rectangle = rectangle.filter((p) => {
            return map.is_in_bounds(p);
        })
        map.add_event({name: event_names.delay, behavior: delay_event(i + 1, delay(rectangle))});
    }
}