function setup_settings_page(){
    setup_controls_page();
}

function setup_settings_navbar(){
    var id = UIIDS.settings_navbar;

    var section_id_list = [
        UIIDS.general_settings,
        UIIDS.controls,
    ];

    var swap_visibility = function(id_list, id){
        return function(){
            display.swap_screen(id_list, id);
        }
    }

    display.create_visibility_toggle(id, settings_navbar_labels.general, swap_visibility(section_id_list, UIIDS.general_settings));
    display.create_visibility_toggle(id, settings_navbar_labels.controls, swap_visibility(section_id_list, UIIDS.controls));

    display.swap_screen(section_id_list, UIIDS.general_settings);
}