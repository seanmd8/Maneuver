
function ancient_card(){
    return {
        name: boon_names.ancient_card,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        description: add_card_description,
        on_pick: pick_ancient_card,
        unlocks: [ancient_card]
    }
}

function pick_ancient_card(){
    GS.deck.add(lost_technique());
}

function ancient_card_2(){
    return {
        name: boon_names.ancient_card,
        pic: `${IMG_FOLDER.cards}lost_maneuver.png`,
        description: add_card_description,
        on_pick: pick_ancient_card_2,
        unlocks: [ancient_card_2]
    }
}

function pick_ancient_card_2(){
    GS.deck.add(lost_maneuver());
}
