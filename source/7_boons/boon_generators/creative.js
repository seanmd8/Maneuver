function creative(){
    return {
        name: boon_names.creative,
        pic: `${IMG_FOLDER.boons}creative.png`,
        description: boon_descriptions.creative,
        cost_description: boon_cost_descriptions.creative,
        prereq_description: boon_prereq_descriptions.creative,
        prereq: prereq_creative,
        on_pick: pick_creative,
        max: 1,
    }
}

function prereq_creative(){
    return GS.deck.deck_size() >= 10;
}

function pick_creative(){
    GS.deck.alter_hand_size(1);
    GS.deck.deal();
    GS.refresh_deck_display();
    var has_voucher = GS.boons.has(boon_names.soul_voucher);
    if(!has_voucher){
        GS.deck.alter_min(5);
    }
}