
function expend_vitality(){
    return {
        name: boon_names.expend_vitality,
        pic: `${IMG_FOLDER.boons}expend_vitality.png`,
        description: expend_vitality_description,
        prereq: prereq_expend_vitality,
        on_pick: pick_expend_vitality
    }
}

function prereq_expend_vitality(){
    return GS.map.get_player().max_health > 1;
}

function pick_expend_vitality(){
    change_max_health(-1);
}