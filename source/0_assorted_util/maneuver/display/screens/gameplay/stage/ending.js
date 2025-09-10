function display_victory(){
    display.toggle_visibility(UIIDS.hand_box, false);
    display.toggle_visibility(UIIDS.move_box, false);
    display.toggle_visibility(UIIDS.retry_box, false);
    display.remove_children(UIIDS.map_display);
    display.add_tb_row(UIIDS.map_display, [{
        name: achievement_names.victory,
        //foreground: [`${image_folder.other}border.png`],
        pic: `${IMG_FOLDER.achievements}victory.png`,
        on_click: () => {
            display.toggle_visibility(UIIDS.hand_box, true);
            display.toggle_visibility(UIIDS.move_box, true);
            display.toggle_visibility(UIIDS.retry_box, true);
            player_hand_greyed(false);
            GS.setup();
        },
    }], VICTORY_IMG_SCALE);
}