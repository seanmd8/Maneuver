function expend_vitality(){
    return {
        name: boon_names.expend_vitality,
        pic: `${IMG_FOLDER.boons}expend_vitality.png`,
        description: boon_descriptions.expend_vitality,
        cost_description: boon_cost_descriptions.expend_vitality,
        prereq_description: boon_prereq_descriptions.expend_vitality,
        prereq: prereq_expend_vitality,
        on_pick: pick_expend_vitality,
        max: 1,
    }
}

function prereq_expend_vitality(){
    return max_health_at_least(1);
}

function pick_expend_vitality(){
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        change_max_health(-1);
    }
}