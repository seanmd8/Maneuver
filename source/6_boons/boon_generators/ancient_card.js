
function ancient_card(){
    return {
        name: boon_names.ancient_card,
        pic: `${IMG_FOLDER.cards}lost_technique.png`,
        description: ancient_card_description,
        on_pick: pick_ancient_card,
        unlocks: [ancient_card]
    }
}

function pick_ancient_card(){
    GS.deck.add(lost_technique());
}
