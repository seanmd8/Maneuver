function shattered_glass(){
    return {
        name: boon_names.shattered_glass,
        pic: `${IMG_FOLDER.boons}shattered_glass.png`,
        description: shattered_glass_description,
        prereq: prereq_shattered_glass,
        on_pick: on_pick_shattered_glass
    }
}

function prereq_shattered_glass(){
    return max_health_at_least(2);
}

function on_pick_shattered_glass(){
    change_max_health(-2);
}

// Enemies explode on death