/**
 * Displays the full deck to it's proper location.
 */
function refresh_full_deck_display(deck){
    var full = deck.get_deck_info();
    display.remove_children(UIIDS.full_deck_table);
    display.add_tb_row(UIIDS.full_deck_table, full, SMALL_CARD_SCALE);
}