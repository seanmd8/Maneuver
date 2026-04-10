function reckless_speed(){
    return {
        name: boon_names.reckless_speed,
        pic: `${IMG_FOLDER.boons}reckless_speed.png`,
        description: boon_descriptions.reckless_speed,
        prereq_description: boon_prereq_descriptions.none,
        max: 1,
    }
}

function check_for_moves(behavior){
    for(var action of behavior){
        switch(action.type){
            case action_types.move:
            case action_types.move_until:
            case action_types.teleport:
                return true;
            default:
                break;
        }
    }
    return false;
}