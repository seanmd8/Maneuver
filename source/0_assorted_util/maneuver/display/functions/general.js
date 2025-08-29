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
            label: screen_names.controls,
            on_change: () => {
                setup_controls_page();
                DISPLAY_DIVISIONS.swap(UIIDS.controls);
            }
        },
        {
            label: screen_names.achievements,
            on_change: () => {
                update_achievements();
                DISPLAY_DIVISIONS.swap(UIIDS.achievements);
            }
        }
    ];
    display.create_dropdown(location, options);
}