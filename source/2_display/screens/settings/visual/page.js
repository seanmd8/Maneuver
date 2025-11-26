function reset_visual_settings_page(){
    display.remove_children(UIIDS.settings_visual);
    var settings = GS.data.settings;
    display.visual_settings(UIIDS.settings_visual, settings);
}