/**
 * @param {Point[]} locations A grid of locations to use.
 * @returns {MapEventFunction} The event.
 */
function shockwave_event(locations){
    var harm = function(locations){
        return function(map_to_use){
            for(var location of locations){
                var tile = map_to_use.get_tile(location);
                if(!tile.tags.has(TAGS.altar) && !tile.tags.has(TAGS.boss)){
                    map_to_use.attack(location);
                }
            }
        }
    }
    var wave = function(){
        return function(map_to_use){
            var targets = [];
            for(var space of locations){
                if(map_to_use.is_in_bounds(space)){
                    map_to_use.mark_event(space, shockwave_mark());
                    targets.push(space);
                }
            }
            map_to_use.add_event({name: event_names.shockwave, behavior: harm(targets)});
        }
    }
    return wave();
}