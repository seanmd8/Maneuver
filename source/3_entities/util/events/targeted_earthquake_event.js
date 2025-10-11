/**
 * @param {Point[]} locations A grid of locations to use.
 * @returns {MapEventFunction} The event.
 */
function targeted_earthquake_event(locations){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
            }
        }
    }
    var earthquake = function(){
        return function(map_to_use){
            var rubble = [];
            for(var space of locations){
                map_to_use.mark_event(space, falling_rubble_mark());
                rubble.push(space);
            }
            map_to_use.add_event({name: event_names.falling_rubble, behavior: falling_rubble(rubble)});
        }
    }
    return earthquake();
}