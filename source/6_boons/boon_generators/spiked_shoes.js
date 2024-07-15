
function spiked_shoes(){
    return {
        name: boon_names.spiked_shoes,
        pic: `${IMG_FOLDER.boons}spiked_shoes.png`,
        description: spiked_shoes_description,
        prereq: prereq_spiked_shoes,
        on_pick: pick_spiked_shoes
    }
}

function prereq_spiked_shoes(){
    return max_health_at_least(1);
}

function pick_spiked_shoes(){
    change_max_health(-1);
}
