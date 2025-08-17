
function duplicate(){
    return {
        name: boon_names.duplicate,
        pic: `${IMG_FOLDER.boons}duplicate.png`,
        description: duplicate_description,
        after_pick: pick_duplicate,
        unlocks: [duplicate]
    }
}

function pick_duplicate(){
    display_deck_to_duplicate();
    GAME_SCREEN_DIVISIONS.swap(UIIDS.deck_select);
}