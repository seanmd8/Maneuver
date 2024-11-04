

function display_boons(boon_list){
    // Updates the list of boons they have.
    display.remove_children(UIIDS.boon_list_table);
    var gained = boon_list.get_gained();
    display.add_tb_row(UIIDS.boon_list_table, gained, SMALL_CARD_SCALE);

    // Updates the list of used up boons.
    display.remove_children(UIIDS.removed_boon_table);
    var lost = boon_list.get_lost();
    display.add_tb_row(UIIDS.removed_boon_table, lost, SMALL_CARD_SCALE);
}

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

/**
 * Displays the hand to it's proper location.
 */
function refresh_hand_display(deck){
    // Updates the hand.
    var card_row = deck.get_hand_info();
    display.remove_children(UIIDS.hand_display);
    display.add_tb_row(UIIDS.hand_display, card_row, CARD_SCALE);

    // Shows how many cards are left in your deck.
    var remaining = deck.get_deck_count();
    display.display_message(UIIDS.deck_count, `${remaining}`);

    // Makes sure the card info button shows that no card is selected.
    var explain_blank_moves = function(){
        say(blank_moves_message, false);
    }
    display.add_on_click(UIIDS.move_info, explain_blank_moves);
}
/**
 * Displays the discard pile to it's proper location.
 */
function refresh_discard_display(deck){
    var discard = deck.get_discard_info();
    display.remove_children(UIIDS.discard_pile_table);
    display.add_tb_row(UIIDS.discard_pile_table, discard, SMALL_CARD_SCALE);
}
/**
 * Displays the library to it's proper location.
 */
function refresh_deck_order_display(deck){
    var library = deck.get_library_info();
    display.remove_children(UIIDS.deck_order_table);
    display.add_tb_row(UIIDS.deck_order_table, [future_sight(), ...library], SMALL_CARD_SCALE);
}

function telegraph_repetition_boon(repeat){
    display.remove_class(UIIDS.hand_box, `telegraph-repetition`);
    display.remove_class(UIIDS.move_box, `telegraph-repetition`);
    display.remove_class(UIIDS.hand_box, `no-repetition`);
    display.remove_class(UIIDS.move_box, `no-repetition`);
    var class_name = repeat ? `telegraph-repetition` : `no-repetition`;
    display.add_class(UIIDS.hand_box, class_name);
    display.add_class(UIIDS.move_box, class_name);
}

function display_entire_deck(deck){
    // Display section header.
    var min_deck_size = deck.deck_min();
    display.display_message(UIIDS.current_deck, `${current_deck}${min_deck_size}):`);
    // Display deck with limited cards per line.
    var decklist = deck.get_deck_info();
    for(var i = 0; i < Math.ceil(decklist.length / DECK_DISPLAY_WIDTH); ++i){
        var row = decklist.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH);
        display.add_tb_row(UIIDS.display_deck, row, CARD_SCALE);
    }

}

function display_map(map){
    // Updates the GameMap display.
    display.remove_children(UIIDS.map_display);
    var grid = map.display();
    for(var row of grid){
        display.add_tb_row(UIIDS.map_display, row, TILE_SCALE);
    }
    map.clear_telegraphs();
    // Updates the health bar display.
    display.remove_children(UIIDS.health_display);
    display_health(map.get_player(), TILE_SCALE);
    // Updates the initiative tracker display.
    update_initiative(map);
}

function explain_card(card){
    var text = ``;
    text += `${move_types.alt}\n`;
    text += `\n`;
    text += `${card.options.explain_buttons()}`;
    text += `\n`;
    if(card.per_floor !== undefined){
        text += `${move_types.per_floor}\n`;
    }
    else if(card.temp){
        text += `${move_types.temp}\n`;
    }
    if(card.options.is_instant()){
        text += `${move_types.instant}\n`;
    }
    say(text, false);
}

/**
 * Function to give a message to the user.
 * @param {string} msg message text.
 * @param {boolean} record If true, also adds it to the chat log.
 */
function say(msg, record = true){
    if(msg === ``){
        record = false;
    }
    display.display_message(UIIDS.display_message, msg);
    if(record){
        GS.record_message(msg);
    }
}

function update_initiative(map){
    var info = map.get_initiative().map(e => {
        let str = `${e.name}\n` + hp_description(e);
        let on_click = function(){
            display.click(`${UIIDS.map_display} ${e.location.y} ${e.location.x}`);
        }
        return {
            pic: e.pic,
            rotate: e.rotate,
            flip: e.flip,
            stun: e.stun !== undefined && e.stun > 0,
            name: e.name,
            str,
            on_click,
        }
    });
    display.remove_children(UIIDS.initiative);
    display.create_initiative(UIIDS.initiative, info, INITIATIVE_SCALE);
}