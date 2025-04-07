/** @type {FloorGenerator} Generates the floor where the Shadow of Self appears.*/
function shadow_of_self_floor(floor_num,  area, map){
    // Change to spawn on far wall mirroring player
    var shadow = shadow_of_self_tile();
    map.spawn_safely(shadow, SAFE_SPAWN_ATTEMPTS, true);

    // Swaps tab to the one containing it's hand
    display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.shadow_hand, function(){
        display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.shadow_hand);
    });
    display.swap_screen(SIDEBAR_DIVISIONS, UIIDS.shadow_hand);
    refresh_shadow_hand_display(shadow.deck.get_hand_info());


    for(var i = 0; i < 6; ++i){
        map.add_tile(wall_tile());
    }

    return shadow_of_self_floor_message;
}