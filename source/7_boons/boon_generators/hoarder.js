function hoarder(){
    return {
        name: boon_names.hoarder,
        pic: `${IMG_FOLDER.boons}hoarder.png`,
        description: boon_descriptions.hoarder,
        cost_description: boon_cost_descriptions.hoarder,
        prereq_description: boon_prereq_descriptions.hoarder,
        prereq: prereq_hoarder,
        on_pick: pick_hoarder,
        max: 1,
    }
}

function prereq_hoarder(){
    return GS.map.get_floor_num() < 15;
}

function pick_hoarder(){
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        GS.map.stats.alter_boon_chest_choices(-1);
    }
}