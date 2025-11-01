function controls_chest_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.chest_controls, CONTROLS_TEXT.chest.header, edit_chest_controls);
    display.control_box(UIIDS.chest_controls, controls.chest.choose.slice(0, 3), CONTROLS_TEXT.chest.choose);
    display.control_box(UIIDS.chest_controls, controls.chest.confirm, CONTROLS_TEXT.chest.confirm);
    display.control_box(UIIDS.chest_controls, controls.chest.reject, CONTROLS_TEXT.chest.reject);
}

function edit_chest_controls(controls){
    display.add_edit_controls_header(UIIDS.chest_controls, CONTROLS_TEXT.chest.header, controls_chest_section, controls);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.choose, CONTROLS_TEXT.chest.choose);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.confirm, CONTROLS_TEXT.chest.confirm);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.reject, CONTROLS_TEXT.chest.reject);
}