function empty_rooms(){
    return {
        name: boon_names.empty_rooms,
        pic: `${IMG_FOLDER.boons}empty_rooms.png`,
        description: boon_descriptions.empty_rooms,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_empty_rooms,
    }
}
function pick_empty_rooms(){
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        GS.map.change_floor_modifier(-3);
    }
}