/**
 * Displays the library to it's proper location.
 */
function refresh_deck_order_display(deck){
    var library = deck.get_library_info();
    var card_explanation = (card) => {
        return () => {
            say(explain_card(card));
        }
    };
    for(var card of library){
            card.on_click = card_explanation(card);
    }
    library = [future_sight(), ...library];
    library[0].on_click = () => {
        say(future_sight().description);
    }
    display.remove_children(UIIDS.deck_order_table);
    display.add_tb_row(UIIDS.deck_order_table, library, SMALL_CARD_SCALE);
}