/**
 * Function to create an event function representing an earthquake that gets stronger over time.
 * @param {number} amount The amount of falling debris that should be created.
 * @returns {MapEventFunction} The event.
 */
function earthquake_event(amount){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
                var next_wave = eternal_earthquake_event(locations.length + 5);
                map_to_use.add_event({name: event_names.earthquake, behavior: next_wave});
            }
        }
    }
    var earthquake = function(amount){
        var falling_rubble_layer = {
            pic: `${IMG_FOLDER.tiles}falling_rubble.png`,
            description: event_descriptions.falling_rubble,
            telegraph: hazard_telegraph
        }
        return function(map_to_use){
            var rubble = [];
            var space;
            if(locations === undefined){
                for(var j = 0; j < amount; ++j){
                    space = map_to_use.random_empty();
                    map_to_use.mark_event(space, falling_rubble_layer);
                    rubble.push(space);
                }
            }
            else{
                var spaces = rand_no_repeats(locations, amount);
                for(var i = 0; i < amount; ++i){
                    space = spaces[i];
                    if(map_to_use.check_empty(space)){
                        map_to_use.mark_event(space, falling_rubble_layer);
                        rubble.push(space);
                    }
                }
            }
            map_to_use.add_event({name: event_names.falling_rubble, behavior: falling_rubble(rubble)});
        }
    }
    return earthquake(amount);
}