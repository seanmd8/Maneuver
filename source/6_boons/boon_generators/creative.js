function creative(){
    return {
        name: boon_names.creative,
        pic: `${IMG_FOLDER.boons}creative.png`,
        description: boon_descriptions.creative,
        prereq: prereq_creative,
        on_pick: pick_creative
    }
}

function prereq_creative(){
    return GS.deck.deck_size() >= 10;
}

function pick_creative(){
    GS.deck.alter_min(5);
    GS.deck.alter_hand_size(1);
    GS.deck.deal();
    GS.refresh_deck_display();
}