
function gruntwork(){
    return {
        name: boon_names.gruntwork,
        pic: `${IMG_FOLDER.boons}gruntwork.png`,
        description: boon_descriptions.gruntwork,
        prereq: prereq_gruntwork,
        on_pick: pick_gruntwork
    }
}

function prereq_gruntwork(){
    return GS.map.get_player().max_health !== undefined;
}

function pick_gruntwork(){
    change_max_health(3);
    GS.deck.alter_hand_size(-1);
    GS.deck.deal();
    GS.refresh_deck_display();
}