function controls_stage_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.stage_controls, CONTROLS_TEXT.stage.header, edit_stage_controls);
    display.control_box(UIIDS.stage_controls, controls.stage.card.slice(0, 3), CONTROLS_TEXT.stage.card);
    display.control_box(UIIDS.stage_controls, controls.stage.direction, CONTROLS_TEXT.stage.direction);
    display.control_box(UIIDS.stage_controls, controls.toggle.alt, CONTROLS_TEXT.stage.toggle);
    display.control_box(UIIDS.stage_controls, controls.stage.info, CONTROLS_TEXT.stage.info);
    display.control_box(UIIDS.stage_controls, controls.stage.retry, CONTROLS_TEXT.stage.retry);
}

function edit_stage_controls(controls){
    display.add_edit_controls_header(UIIDS.stage_controls, CONTROLS_TEXT.stage.header, controls_stage_section, controls);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.card, CONTROLS_TEXT.stage.card);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.direction, CONTROLS_TEXT.stage.direction);
    display.control_edit_box(UIIDS.stage_controls, controls.toggle.alt, CONTROLS_TEXT.stage.toggle);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.info, CONTROLS_TEXT.stage.info);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.retry, CONTROLS_TEXT.stage.retry);
}