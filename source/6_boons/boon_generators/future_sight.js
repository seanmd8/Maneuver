function future_sight(){
    return {
        name: boon_names.future_sight,
        pic: `${IMG_FOLDER.boons}future_sight.png`,
        description: boon_descriptions.future_sight,
        prereq_description: boon_prereq_descriptions.none,
        on_pick: pick_future_sight,
        max: 1,
    }
}

function pick_future_sight(){
    display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.deck_order, function(){
        SIDEBAR_DIVISIONS.swap(UIIDS.deck_order);
    });
    SIDEBAR_DIVISIONS.swap(UIIDS.deck_order);
}