

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
    display.select(UIIDS.hand_display, 0, hand_position);
    display.remove_children(UIIDS.move_buttons);
    var button_data = card.options.show_buttons(hand_position);
    for(let row of button_data){
        let button_row = row.map(button => {return {
            description: button.description,
            on_click: function(){
                GS.data.controls.alternate_is_pressed ? button.alt_click() : button.on_click();
            }
        }});
        display.add_button_row(UIIDS.move_buttons, button_row);
    }
    var explanation = move_types.alt + `\n` + explain_card(card);
    display.add_on_click(UIIDS.move_info, function(){say(explanation, false)});
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
    var card_explanation = (card) => {
        return () => {
            display.display_message(UIIDS.shop_message, explain_card(card))       
        }
    };
    for(var card of decklist){
            card.on_click = card_explanation(card);
    }
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
    text += card.evolutions !== undefined ? `${move_types.evolutions}\n\n` : ``;
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
    return text.trimEnd();
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

/**
 * Refreshes the display of a Shadow of Self's hand
 */
function refresh_shadow_hand_display(hand){
    hand = hand.map(choice => {
        return {
            pic: choice.pic,
            name: choice.name,
            background: choice.background,
            card: choice.card
        }
    })
    display.remove_children(UIIDS.shadow_hand_table);
    display.add_tb_row(UIIDS.shadow_hand_table, hand, SMALL_CARD_SCALE);
}

function shadow_hand_select(position){
    display.select(UIIDS.shadow_hand_table, 0, position)
}

function player_hand_greyed(is_greyed){
    var toggle = is_greyed ? display.add_class : display.remove_class;
    toggle(UIIDS.hand_display, `greyed-out`);
}

function refresh_shop_display(shop){
    var refresh = (f, card) => {
        return () => {
            f();
            display.display_message(UIIDS.shop_message, explain_card(card));
            refresh_shop_display(shop);
        }
    };
    display.remove_children(UIIDS.add_card);
    display.remove_children(UIIDS.remove_card);

    var add_row = shop.get_add_row();
    for(var a of add_row){
        if(a.on_click !== undefined){
            a.on_click = refresh(a.on_click, a.card);
        }
        else{
            a.on_click = () => {display.display_message(UIIDS.shop_message, shop_add_description)};
        }
    }
    display.add_tb_row(UIIDS.add_card, add_row, CARD_SCALE);

    var remove_row = shop.get_remove_row();
    for(var r of remove_row){
        if(r.on_click !== undefined){
            r.on_click = refresh(r.on_click, r.card);
        }
        else if(r.name === `Remove`){
            r.on_click = () => {display.display_message(UIIDS.shop_message, shop_remove_description)};
        }
        else{
            r.on_click = () => {display.display_message(UIIDS.shop_message, shop_min_description)};
        }
    }
    display.add_tb_row(UIIDS.remove_card, remove_row, CARD_SCALE);
    
    var confirm = () => {
        if(shop.is_valid_selection()){
            shop.confirm();
            GS.new_floor();
        }
        else{
            display.display_message(UIIDS.shop_message, shop_confirm_description);
        }
    }
    display.set_button(UIIDS.shop_confirm, confirm_text, confirm, shop.is_valid_selection());
}

function setup_controls_page(){
    display.remove_children(UIIDS.stage_controls);
    controls_stage_section();
    display.remove_children(UIIDS.shop_controls);
    controls_shop_section();
    display.remove_children(UIIDS.chest_controls);
    controls_chest_section();
}

function controls_stage_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.stage_controls, CONTROLS_TEXT.stage.header, edit_stage_controls);
    display.control_box(UIIDS.stage_controls, controls.stage.card.slice(0, 3), CONTROLS_TEXT.stage.card);
    display.control_box(UIIDS.stage_controls, controls.stage.direction, CONTROLS_TEXT.stage.direction);
    display.control_box(UIIDS.stage_controls, controls.toggle.alt, CONTROLS_TEXT.stage.toggle);
    display.control_box(UIIDS.stage_controls, controls.stage.info, CONTROLS_TEXT.stage.info);
    display.control_box(UIIDS.stage_controls, controls.stage.retry, CONTROLS_TEXT.stage.retry);
}

function controls_shop_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.shop_controls, CONTROLS_TEXT.shop.header, edit_shop_controls);
    display.control_box(UIIDS.shop_controls, controls.shop.add.slice(0, 3), CONTROLS_TEXT.shop.add);
    display.control_box(UIIDS.shop_controls, controls.shop.remove.slice(0, 3), CONTROLS_TEXT.shop.remove);
    display.control_box(UIIDS.shop_controls, controls.shop.confirm, CONTROLS_TEXT.shop.confirm);
}

function controls_chest_section(){
    var controls = GS.data.controls.get();
    display.add_controls_header(UIIDS.chest_controls, CONTROLS_TEXT.chest.header, edit_chest_controls);
    display.control_box(UIIDS.chest_controls, controls.chest.choose.slice(0, 3), CONTROLS_TEXT.chest.choose);
    display.control_box(UIIDS.chest_controls, controls.chest.confirm, CONTROLS_TEXT.chest.confirm);
    display.control_box(UIIDS.chest_controls, controls.chest.reject, CONTROLS_TEXT.chest.reject);
}

function edit_stage_controls(controls){
    display.add_edit_controls_header(UIIDS.stage_controls, CONTROLS_TEXT.stage.header, controls_stage_section, controls);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.card, CONTROLS_TEXT.stage.card);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.direction, CONTROLS_TEXT.stage.direction);
    display.control_edit_box(UIIDS.stage_controls, controls.toggle.alt, CONTROLS_TEXT.stage.toggle);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.info, CONTROLS_TEXT.stage.info);
    display.control_edit_box(UIIDS.stage_controls, controls.stage.retry, CONTROLS_TEXT.stage.retry);
}

function edit_shop_controls(controls){
    display.add_edit_controls_header(UIIDS.shop_controls, CONTROLS_TEXT.shop.header, controls_shop_section, controls);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.add, CONTROLS_TEXT.shop.add);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.remove, CONTROLS_TEXT.shop.remove);
    display.control_edit_box(UIIDS.shop_controls, controls.shop.confirm, CONTROLS_TEXT.shop.confirm);
}

function edit_chest_controls(controls){
    display.add_edit_controls_header(UIIDS.chest_controls, CONTROLS_TEXT.chest.header, controls_chest_section, controls);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.choose, CONTROLS_TEXT.chest.choose);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.confirm, CONTROLS_TEXT.chest.confirm);
    display.control_edit_box(UIIDS.chest_controls, controls.chest.reject, CONTROLS_TEXT.chest.reject);
}
