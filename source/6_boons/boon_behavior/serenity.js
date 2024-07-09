
function serenity(){
    return {
        name: boon_names.serenity,
        pic: `${IMG_FOLDER.boons}serenity.png`,
        description: serenity_description,
        prereq: prereq_serenity,
        on_pick: pick_serenity
    }
}

function prereq_serenity(){
    return GS.deck.deck_min() > 4;
}

function pick_serenity(){
    GS.deck.alter_min(-1);
}
// Todo:
//  description
//  implement
//  move min_deck_size?