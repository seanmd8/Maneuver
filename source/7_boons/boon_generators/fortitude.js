function fortitude(){
    return {
        name: boon_names.fortitude,
        pic: `${IMG_FOLDER.boons}fortitude.png`,
        description: boon_descriptions.fortitude,
        prereq_description: boon_prereq_descriptions.fortitude,
        prereq: prereq_fortitude,
        on_pick: pick_fortitude,
    }
}

function prereq_fortitude(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_fortitude(){
    change_max_health(1);
    GS.map.heal(GS.map.get_player_location(), 1);
}