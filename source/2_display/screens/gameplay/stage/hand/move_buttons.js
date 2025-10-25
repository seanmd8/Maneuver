function display_move_buttons(card, hand_position){
    display.select(UIIDS.hand_display, 0, hand_position);
    display.remove_children(UIIDS.move_buttons);
    var button_data = card.options.show_buttons(hand_position);
    for(var i = 0; i < button_data.length; ++i){
        let row = button_data[i];
        let button_row = row.map(button => {
            return {
                description: button.description,
                on_click: function(){
                    GS.data.controls.alternate_is_pressed ? button.alt_click() : button.on_click();
                },
                colors: button.colors
            }
        });
        display.add_button_row(UIIDS.move_buttons, button_row);
        for(var j = 0; j < button_row.length; ++j){
            display.add_gradient(`${UIIDS.move_buttons} ${i} ${j}`, button_row[j].colors);
        }
    }
    var explanation = move_types.alt + `\n` + explain_card(card);
    display.add_on_click(UIIDS.move_info, function(){say(explanation)});
}
function get_colors(actions){
    if(actions === undefined){
        return [action_type_colors.none];
    }
    var colors = [];
    for(var action of actions){
        var color = COLOR_MAP.get(action.type);
        if(!colors.includes(color)){
            colors.push(color);
        }
    }
    if(colors.length === 0){
        colors.push(action_type_colors.do_nothing);
    }
    return colors;
}