
function future_sight(){
    return {
        name: boon_names.future_sight,
        pic: `${IMG_FOLDER.boons}future_sight.png`,
        description: future_sight_description,
        on_pick: pick_future_sight
    }
}

function pick_future_sight(){
    display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.deck_order, function(){
        display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.deck_order);
    });
    display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.deck_order);
}