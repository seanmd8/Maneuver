function expend_vitality(){
    return {
        name: boon_names.expend_vitality,
        pic: `${IMG_FOLDER.boons}expend_vitality.png`,
        description: boon_descriptions.expend_vitality,
        prereq: prereq_expend_vitality,
        on_pick: pick_expend_vitality
    }
}

function prereq_expend_vitality(){
    return max_health_at_least(1);
}

function pick_expend_vitality(){
    change_max_health(-1);
}