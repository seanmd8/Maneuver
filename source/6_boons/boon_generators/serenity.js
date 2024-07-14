
function serenity(){
    return {
        name: boon_names.serenity,
        pic: `${IMG_FOLDER.boons}serenity.png`,
        description: serenity_description,
        prereq: prereq_serenity,
        on_pick: pick_serenity,
        unlocks: [serenity]
    }
}

function prereq_serenity(){
    return GS.deck.deck_min() > 4;
}

function pick_serenity(){
    while(GS.deck.deck_min() > 4){
        GS.deck.alter_min(-1);
    }
}