
function roar_of_challenge(){
    return {
        name: boon_names.roar_of_challenge,
        pic: `${IMG_FOLDER.boons}roar_of_challenge.png`,
        description: boon_descriptions.roar_of_challenge,
        prereq: prereq_roar_of_challenge,
        on_pick: pick_roar_of_challenge,
        unlocks: [roar_of_challenge]
    }
}

function prereq_roar_of_challenge(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_roar_of_challenge(){
    change_max_health(2);
}