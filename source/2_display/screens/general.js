/**
 * Function to create a dropdown menu capable of switching between the game and guide screens.
 * @param {string} location Where to create it.
 */
function create_main_dropdown(location){
    var options = [
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
            label: screen_names.controls,
            on_change: () => {
                setup_controls_page();
                DISPLAY_DIVISIONS.swap(UIIDS.controls);
            }
        },

    ];
    display.create_dropdown(location, options);
}