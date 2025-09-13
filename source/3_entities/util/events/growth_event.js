/**
 * Function to create an event function representing hazardous growth.
 * @param {Point[]} points A grid of locations to grow things at.
 * @returns {MapEventFunction} The event.
 */
function growth_event(points, root, grown){
    var grow = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
                if(map_to_use.check_empty(location)){
                    map_to_use.add_tile(grown(), location);
                }
            }
        }
    }
    var plant = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.mark_event(location, root);
            }
            map_to_use.add_event({name: grown().name, behavior: grow(locations)});
        }
    }
    return plant(points);
}