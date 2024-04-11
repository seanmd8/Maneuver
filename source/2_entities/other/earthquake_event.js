/** @type {TileGenerator} Used to show which location will have falling rubble next turn.*/
function falling_rubble_look(){
    return {
        type: `look`,
        name: `falling rubble`,
        pic: `${IMG_FOLDER.tiles}falling_rubble.png`,
        description: falling_rubble_description
    }
}

/**
 * Function to create an event function representing an earthquake.
 * @param {number} amount The amount of falling debris that should be created.
 * @returns {MapEventFunction} The earthquake event.
 */
function earthquake_event(amount){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
            }
        }
    }
    var earthquake = function(amount){
        return function(map_to_use){
            var rubble = [];
            for(var j = 0; j < amount; ++j){
                var space = map_to_use.random_empty();
                map_to_use.mark_tile(space, falling_rubble_look);
                rubble.push(space);
            }
            map_to_use.add_event({name: `Falling Rubble`, behavior: falling_rubble(rubble)});
        }
        
    }
    return earthquake(amount);
}
