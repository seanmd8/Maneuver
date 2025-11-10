function soul_voucher(){
    return {
        name: boon_names.soul_voucher,
        pic: `${IMG_FOLDER.boons}soul_voucher.png`,
        description: boon_descriptions.soul_voucher,
        cost_description: boon_cost_descriptions.soul_voucher,
        prereq_description: boon_prereq_descriptions.soul_voucher,
        prereq: prereq_soul_voucher,
        on_pick: on_pick_soul_voucher,
        max: 1,
    }
}

function prereq_soul_voucher(){
    return max_health_greater_than(1) && GS.map.get_floor_num() < 15;
}

function on_pick_soul_voucher(){
    change_max_health(-1);
}