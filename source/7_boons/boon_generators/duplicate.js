function duplicate(){
    return {
        name: boon_names.duplicate,
        pic: `${IMG_FOLDER.boons}duplicate.png`,
        description: boon_descriptions.duplicate,
        prereq_description: boon_prereq_descriptions.none,
        after_pick: pick_duplicate,
    }
}

function pick_duplicate(){
    display_deck_to_duplicate();
    GAME_SCREEN_DIVISIONS.swap(UIIDS.deck_select);
}