function clairvoyance(){
    return {
        name: boon_names.clairvoyance,
        pic: `${IMG_FOLDER.boons}clairvoyance.png`,
        description: boon_descriptions.clairvoyance,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_clairvoyance,
        max: 1,
    }
}

function pick_clairvoyance(){
    display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.deck_order, function(){
        SIDEBAR_DIVISIONS.swap(UIIDS.deck_order);
    });
    SIDEBAR_DIVISIONS.swap(UIIDS.deck_order);
}