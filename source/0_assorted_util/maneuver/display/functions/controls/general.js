function setup_controls_page(){
    display.remove_children(UIIDS.stage_controls);
    controls_stage_section();
    display.remove_children(UIIDS.shop_controls);
    controls_shop_section();
    display.remove_children(UIIDS.chest_controls);
    controls_chest_section();
}
