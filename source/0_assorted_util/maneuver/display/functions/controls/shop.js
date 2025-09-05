function controls_shop_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.shop_controls, CONTROLS_TEXT.shop.header, edit_shop_controls);
    display.control_box(UIIDS.shop_controls, controls.shop.add.slice(0, 3), CONTROLS_TEXT.shop.add);
    display.control_box(UIIDS.shop_controls, controls.shop.remove.slice(0, 3), CONTROLS_TEXT.shop.remove);
    display.control_box(UIIDS.shop_controls, controls.shop.confirm, CONTROLS_TEXT.shop.confirm);
}

function edit_shop_controls(controls){
    display.add_edit_controls_header(UIIDS.shop_controls, CONTROLS_TEXT.shop.header, controls_shop_section, controls);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.add, CONTROLS_TEXT.shop.add);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.remove, CONTROLS_TEXT.shop.remove);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.confirm, CONTROLS_TEXT.shop.confirm);
}