
function fortitude(){
    return {
        name: boon_names.fortitude,
        pic: `${IMG_FOLDER.boons}fortitude.png`,
        description: fortitude_description,
        prereq: prereq_fortitude,
        on_pick: pick_fortitude,
        unlocks: [fortitude]
    }
}

function prereq_fortitude(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_fortitude(){
    change_max_health(1);
}