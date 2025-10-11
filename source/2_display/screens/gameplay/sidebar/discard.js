/**
 * Displays the discard pile to it's proper location.
 */
function refresh_discard_display(deck){
    var discard = deck.get_discard_info();
    var card_explanation = (card) => {
        return () => {
            say(explain_card(card));
        }
    };
    for(var card of discard){
            card.on_click = card_explanation(card);
    }
    display.remove_children(UIIDS.discard_pile_table);
    display.add_tb_row(UIIDS.discard_pile_table, discard, SMALL_CARD_SCALE);
}