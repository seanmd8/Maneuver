function refresh_deck_select_screen(selector){
    var cards = selector.get_display_info();
    cards.map((card) => {
        var prev_on_click = card.on_click;
        card.on_click = () => {
            prev_on_click();
            display.display_message(UIIDS.deck_select_card_info, explain_card(card.card));
            refresh_deck_select_screen(selector);
        }
        return card;
    });
    display.remove_children(UIIDS.deck_select_table);
    for(var i = 0; i < Math.ceil(cards.length / DECK_DISPLAY_WIDTH); ++i){
        var slice_start = i * DECK_DISPLAY_WIDTH;
        var slice = cards.slice(slice_start, slice_start + DECK_DISPLAY_WIDTH);
        display.add_tb_row(UIIDS.deck_select_table, slice, CARD_SCALE);
    }
    display.set_button(
        UIIDS.deck_select_confirm, 
        shop_text.confirm, 
        () => {selector.confirm();}, 
        selector.check_valid()
    );
}