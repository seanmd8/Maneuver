
function fortitude(){
    return {
        name: boon_names.fortitude,
        pic: `${IMG_FOLDER.boons}fortitude.png`,
        description: fortitude_description,
        on_pick: pick_fortitude,
        unlocks: [fortitude]
    }
}

function pick_fortitude(){
    change_max_health(1);
}