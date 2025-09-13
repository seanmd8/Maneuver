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
        say(gameplay_text.select_card);
    }
    display.add_on_click(UIIDS.move_info, explain_blank_moves);
}

function player_hand_greyed(is_greyed){
    var toggle = is_greyed ? display.add_class : display.remove_class;
    toggle(UIIDS.hand_display, `greyed-out`);
}