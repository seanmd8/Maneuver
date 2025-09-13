/**
 * Function to create an event function representing an earthquake that gets stronger over time.
 * @param {number} amount The amount of falling debris that should be created.
 * @returns {MapEventFunction} The event.
 */
function eternal_earthquake_event(amount){
    var falling_rubble = function(locations){
        return function(map_to_use){
            for(var location of locations){
                map_to_use.attack(location);
            }
        }
    }
    var earthquake = function(amount){
        amount = Math.min(amount, FLOOR_HEIGHT * FLOOR_WIDTH * 4/5)
        var falling_rubble_layer = {
            pic: `${IMG_FOLDER.tiles}falling_rubble.png`,
            description: event_descriptions.falling_rubble,
            telegraph: hazard_telegraph
        }
        return function(map_to_use){
            var rubble = [];
            while(rubble.length < amount){
                var space = map_to_use.random_space();
                if(rubble.find((p) => {
                    return point_equals(p, space);
                }) === undefined){
                    map_to_use.mark_event(space, falling_rubble_layer);
                    rubble.push(space);
                }
            }
            map_to_use.add_event({name: event_names.falling_rubble, behavior: falling_rubble(rubble)});
            var next_wave = eternal_earthquake_event(rubble.length + 5);
            map_to_use.add_event({name: event_names.earthquake, behavior: next_wave});
        }
    }
    return earthquake(amount);
}