/**
 * Displays the full deck to it's proper location in the sidebar.
 */
function refresh_full_deck_display(deck){
    var full = deck.get_deck_info();
    var card_explanation = (card) => {
        return () => {
            say(explain_card(card));
        }
    };
    for(var card of full){
            card.on_click = card_explanation(card);
    }
    display.remove_children(UIIDS.full_deck_table);
    display.add_tb_row(UIIDS.full_deck_table, full, SMALL_CARD_SCALE);
}