function delayed_strike(){
    return {
        name: boon_names.delayed_strike,
        pic: `${IMG_FOLDER.boons}delayed_strike.png`,
        description: boon_descriptions.delayed_strike,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}

function create_delayed_strike(map, point){
    var strike = () => {
        if(!point_equals(map.get_player_location(), point)){
            map.attack(point);
        }
    }
    map.mark_event(point, delayed_strike_mark(), false);
    map.add_event({name: event_names.delayed_strike, behavior: strike});
}
function create_delayed_stun(map, point){
    var stun = () => {
        if(!point_equals(map.get_player_location(), point)){
            map.stun_tile(point);
        }
    }
    map.mark_event(point, delayed_stun_mark(), false);
    map.add_event({name: event_names.delayed_stun, behavior: stun});
}