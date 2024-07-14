
function roar_of_challenge(){
    return {
        name: boon_names.roar_of_challenge,
        pic: `${IMG_FOLDER.boons}roar_of_challenge.png`,
        description: roar_of_challenge_description,
        prereq: prereq_roar_of_challenge,
        on_pick: pick_roar_of_challenge,
        unlocks: [serenity]
    }
}

function prereq_roar_of_challenge(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_roar_of_challenge(){
    change_max_health(2);
}