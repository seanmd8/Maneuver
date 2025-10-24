function soul_voucher(){
    return {
        name: boon_names.soul_voucher,
        pic: `${IMG_FOLDER.boons}soul_voucher.png`,
        description: boon_descriptions.soul_voucher,
        prereq_description: boon_prereq_descriptions.soul_voucher,
        prereq: prereq_soul_voucher,
        max: 1,
    }
}

function prereq_soul_voucher(){
    return GS.map.get_floor_num() < 15;
}