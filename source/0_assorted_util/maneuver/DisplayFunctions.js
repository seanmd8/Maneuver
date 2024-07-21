

function display_move_buttons(card, hand_position){
    display.remove_children(UIIDS.move_buttons);
    var button_data = card.options.show_buttons(hand_position);
    for(let row of button_data){
        let button_row = row.map(button => {return {
            description: button.description,
            on_click: function(){
                display.shift_is_pressed ? button.alt_click() : button.on_click();
            }
        }});
        display.add_button_row(UIIDS.move_buttons, button_row);
    }
    display.add_on_click(UIIDS.move_info, function(){explain_card(card)});
}

function explain_card(card){
    var text = `${temp_card_info(card)}${card.options.explain_card()}`;
    say(text, false);
}