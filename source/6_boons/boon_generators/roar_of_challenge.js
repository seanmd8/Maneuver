
function roar_of_challenge(){
    return {
        name: boon_names.roar_of_challenge,
        pic: `${IMG_FOLDER.boons}roar_of_challenge.png`,
        description: roar_of_challenge_description,
        on_pick: pick_roar_of_challenge,
    }
}

function pick_roar_of_challenge(){
    change_max_health(2);
}