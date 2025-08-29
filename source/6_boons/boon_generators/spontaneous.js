function spontaneous(){
    return {
        name: boon_names.spontaneous,
        pic: `${IMG_FOLDER.boons}spontaneous.png`,
        description: boon_descriptions.spontaneous,
        prereq: prereq_spontaneous,
        on_pick: pick_spontaneous
    }
}

function prereq_spontaneous(){
    return GS.deck.deck_size() >= 10;
}

function pick_spontaneous(){
    GS.deck.alter_min(5);
}