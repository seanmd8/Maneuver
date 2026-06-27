function setup_settings_page(){
    reset_visual_settings_page();
    setup_controls_page();
}

function setup_settings_navbar(){
    var id = UIIDS.settings_navbar;
    SETTINGS_DIVISIONS.set([
        UIIDS.settings_visual,
        UIIDS.controls,
        UIIDS.settings_data,
    ]);
    var swap = function(id){
        return function(){
            SETTINGS_DIVISIONS.swap(id)
        }
    }

    display.create_visibility_toggle(id, settings_navbar_labels.visual, swap(UIIDS.settings_visual));
    display.create_visibility_toggle(id, settings_navbar_labels.controls, swap(UIIDS.controls));
    display.create_visibility_toggle(id, settings_navbar_labels.data, swap(UIIDS.settings_data));

    SETTINGS_DIVISIONS.swap(UIIDS.settings_visual)
}