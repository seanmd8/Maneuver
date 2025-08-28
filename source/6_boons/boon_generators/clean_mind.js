
function clean_mind(){
    return {
        name: boon_names.clean_mind,
        pic: `${IMG_FOLDER.boons}clean_mind.png`,
        description: boon_descriptions.clean_mind,
        prereq_clean_mind,
        after_pick: pick_clean_mind,
        unlocks: [clean_mind]
    }
}

function prereq_clean_mind(){
    // Since you are removing 2 cards, you need to have at least 2 cards above the minimum.
    return GS.deck.deck_size() >= GS.deck.deck_min() + 2;
}

function pick_clean_mind(){
    display_deck_to_remove(2);
    GAME_SCREEN_DIVISIONS.swap(UIIDS.deck_select);

}