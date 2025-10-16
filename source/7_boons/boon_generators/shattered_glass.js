function shattered_glass(){
    return {
        name: boon_names.shattered_glass,
        pic: `${IMG_FOLDER.boons}shattered_glass.png`,
        description: boon_descriptions.shattered_glass,
        cost_description: boon_cost_descriptions.shattered_glass,
        prereq_description: boon_prereq_descriptions.shattered_glass,
        prereq: prereq_shattered_glass,
        on_pick: on_pick_shattered_glass,
        max: 1,
    }
}

function prereq_shattered_glass(){
    return max_health_at_least(2);
}

function on_pick_shattered_glass(){
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        change_max_health(-2);
    }
}