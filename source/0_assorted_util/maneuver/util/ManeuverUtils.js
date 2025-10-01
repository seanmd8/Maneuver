// ----------------ManeuverUtil.js----------------
// File for utility functions used throughout the program.

/**
 * Initiates the game when the page is loaded.
 * @returns {void}
 */
function initiate_game(){
    display.detect_keys();
    display.stop_space_scrolling();
    DISPLAY_DIVISIONS.swap(UIIDS.game_screen);
    display.display_message(UIIDS.title, gameplay_labels.title);
    create_main_dropdown(UIIDS.header_box);
    GS = new GameState();
    GS.setup();
    display_guide();
    setup_journal_navbar();
    setup_controls_page();
}

/**
 * Function to add a random temporary debuff card to the player's deck.
 */
function confuse_player(choices = CONFUSION_CARDS){
    // Chance redused by 50% for each stable_mind boon.
    if(!chance(GS.boons.has(boon_names.stable_mind), 2)){
        var card = random_from(choices)();
        GS.give_temp_card(card);
        GS.refresh_deck_display();
    }
}

function floor_has_chest(floor_of_area){
    if(floor_of_area === CHEST_LOCATION){
        return true;
    }
    if(GS.boons.has(boon_names.hoarder) && floor_of_area === SECOND_CHEST_LOCATION){
        return true;
    }
    return false;
}