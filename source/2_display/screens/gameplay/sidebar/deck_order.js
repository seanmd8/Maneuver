/**
 * Displays the library to it's proper location.
 */
function refresh_deck_order_display(deck){
    var library = deck.get_library_info();
    display.remove_children(UIIDS.deck_order_table);
    display.add_tb_row(UIIDS.deck_order_table, [future_sight(), ...library], SMALL_CARD_SCALE);
}