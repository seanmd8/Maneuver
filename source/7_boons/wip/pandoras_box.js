function pandoras_box(){
    return {
        name: boon_names.pandoras_box,
        pic: `${IMG_FOLDER.boons}pandoras_box.png`,
        description: boon_descriptions.pandoras_box,
        cost_description: boon_cost_descriptions.pandoras_box,
        prereq_description: boon_prereq_descriptions.pandoras_box,
        prereq: prereq_pandoras_box,
        on_pick: pick_pandoras_box,
    }
}

function prereq_pandoras_box(){
    return max_health_at_least(2);
}

function pick_pandoras_box(){
    var reduction = GS.map.get_player().max_health - 1;
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        change_max_health(-reduction);
    }
    for(var i = 0; i < reduction; ++i){
        var boon = GS.boons.get_choices(1)[0];
        var go_back = GS.boons.pick(boon.name);
        return go_back
    }
    GS.refresh_boon_display();
    // note max hp - 1
    // reduce max hp to 1
    // For lost hp, gain new boon
    // catch Safe Passage until the end?
    // Add norandom field?
}