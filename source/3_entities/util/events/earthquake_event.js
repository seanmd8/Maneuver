/**
 * Function to create an event function representing an earthquake.
 * @param {number} amount The amount of falling debris that should be created.
 * @param {Point[]=} locations An optional grid of locations to pick from.
 * @returns {MapEventFunction} The event.
 */
function earthquake_event(amount, locations = undefined){
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
            var space;
            if(locations === undefined){
                for(var j = 0; j < amount; ++j){
                    space = map_to_use.random_empty();
                    map_to_use.mark_event(space, falling_rubble_mark());
                    rubble.push(space);
                }
            }
            else{
                var spaces = rand_no_repeats(locations, amount);
                for(var i = 0; i < amount; ++i){
                    space = spaces[i];
                    if(map_to_use.check_empty(space)){
                        map_to_use.mark_event(space, falling_rubble_mark());
                        rubble.push(space);
                    }
                }
            }
            map_to_use.add_event({name: event_names.falling_rubble, behavior: falling_rubble(rubble)});
        }
    }
    return earthquake(amount);
}