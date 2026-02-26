function medical_investment(){
    return {
        name: boon_names.medical_investment,
        pic: `${IMG_FOLDER.boons}medical_investment.png`,
        description: boon_descriptions.medical_investment,
        cost_description: boon_cost_descriptions.medical_investment,
        prereq_description: boon_prereq_descriptions.medical_investment,
        max: 2,
        prereq: prereq_medical_investment,
        on_pick: pick_medical_investment,
    }
}

function prereq_medical_investment(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_medical_investment(){
    change_max_health(2);
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        GS.map.stats.alter_add_choices(-1);
        GS.map.stats.alter_remove_choices(-1);
    }
}