/**
 * Function to summon altars at specific positions.
 * @param {Point} destination A grid of locations to summon at.
 * @returns {MapEventFunction} The event.
 */
function altar_event(destination, altar){
    var summon = function(location){
        return function(map_to_use){
            map_to_use.attack(location);
            if(map_to_use.check_empty(location)){
                map_to_use.add_tile(altar(), location);
            }
        }
    }
    var rift = function(location){
        return function(map_to_use){
            map_to_use.mark_event(location, starcaller_rift_mark());
            map_to_use.add_event({name: altar().name, behavior: summon(location)});
        }
    }
    return rift(destination);
}