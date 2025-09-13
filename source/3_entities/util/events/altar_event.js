/**
 * Function to create an event function representing hazardous growth.
 * @param {Point} destination A grid of locations to grow things at.
 * @returns {MapEventFunction} The event.
 */
function altar_event(destination, altar){
    var mark = {
        pic: `${IMG_FOLDER.tiles}starcaller_rift.png`,
        description: event_descriptions.starfall,
        telegraph: hazard_telegraph
    }

    var grow = function(location){
        return function(map_to_use){
            map_to_use.attack(location);
            if(map_to_use.check_empty(location)){
                map_to_use.add_tile(altar(), location);
            }
        }
    }
    var plant = function(location){
        return function(map_to_use){
            map_to_use.mark_event(location, mark);
            map_to_use.add_event({name: altar().name, behavior: grow(location)});
        }
    }
    return plant(destination);
}