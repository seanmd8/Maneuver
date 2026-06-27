function controls_screen_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.screen_controls, CONTROLS_TEXT.screen.header, edit_screen_controls);
    display.control_box(UIIDS.screen_controls, controls.screen.change_screen, CONTROLS_TEXT.screen.change);
    display.control_box(UIIDS.screen_controls, controls.screen.tab_left, CONTROLS_TEXT.screen.left);
    display.control_box(UIIDS.screen_controls, controls.screen.tab_right, CONTROLS_TEXT.screen.right);
}

function edit_screen_controls(controls){
    display.add_edit_controls_header(UIIDS.screen_controls, CONTROLS_TEXT.screen.header, controls_screen_section, controls);
    display.control_edit_box(UIIDS.screen_controls, controls.screen.change_screen, CONTROLS_TEXT.screen.change);
    display.control_edit_box(UIIDS.screen_controls, controls.screen.tab_left, CONTROLS_TEXT.screen.left);
    display.control_edit_box(UIIDS.screen_controls, controls.screen.tab_right, CONTROLS_TEXT.screen.right);
}