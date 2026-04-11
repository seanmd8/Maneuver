
function burn_bright(){
    return {
        name: boon_names.burn_bright,
        pic: `${IMG_FOLDER.boons}burn_bright.png`,
        description: boon_descriptions.burn_bright,
        prereq_description: boon_prereq_descriptions.burn_bright,
        prereq: prereq_burn_bright,
        max: 1,
        on_pick: pick_burn_bright,
    }
}

function prereq_burn_bright(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_burn_bright(){
    change_max_health(3);
    GS.map.heal(GS.map.get_player_location(), 3);
}