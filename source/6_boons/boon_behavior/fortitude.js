
function fortitude(){
    return {
        name: boon_names.fortitude,
        pic: `${IMG_FOLDER.boons}fortitude.png`,
        description: fortitude_description,
        on_pick: pick_fortitude,
    }
}

function pick_fortitude(){
    ++GS.map.get_player().max_health;
}