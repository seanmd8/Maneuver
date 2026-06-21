const MAIN_DROPDOWN_OPTIONS = [
    {
        label: screen_names.gameplay,
        on_change: () => {DISPLAY_DIVISIONS.swap(UIIDS.game_screen)}
    }, 
    {
        label: screen_names.guide,
        on_change: () => {DISPLAY_DIVISIONS.swap(UIIDS.guide)}
    },
    {
        label: screen_names.journal,
        on_change: () => {
            update_journal();
            DISPLAY_DIVISIONS.swap(UIIDS.journal);
        }
    },
    {
        label: screen_names.settings,
        on_change: () => {
            setup_settings_page();
            DISPLAY_DIVISIONS.swap(UIIDS.settings);
        }
    },

];

/**
 * Function to create a dropdown menu capable of switching between the game and guide screens.
 * @param {string} location Where to create it.
 */
function create_main_dropdown(location){
    display.create_dropdown(location, MAIN_DROPDOWN_OPTIONS);
}

function scroll_dropdown(change){
    display.traverse_dropdown(`${UIIDS.header_box} select`, MAIN_DROPDOWN_OPTIONS.length, change);
}