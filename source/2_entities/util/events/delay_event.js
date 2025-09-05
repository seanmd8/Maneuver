/**
 * Function to create a function that delays an event function for a specified number of turns.
 * @param {number} turn_count How many turns to delay it.
 * @param {function} delayed_function The event to fire after the delay.
 * @returns {MapEventFunction} The event.
 */
function delay_event(turn_count, delayed_function){
    var delay_function = function(){
        return function(map_to_use){
            if(turn_count > 1){
                map_to_use.add_event({name: event_names.delay, behavior: delay_event(turn_count - 1, delayed_function)});
            }
            else{
                delayed_function(map_to_use);
            }
        }
    }
    return delay_function();
}