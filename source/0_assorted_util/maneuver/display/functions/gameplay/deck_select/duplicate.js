function display_deck_to_duplicate(){
    display.display_message(UIIDS.deck_select_message, boon_messages.duplicate);
    var finish = (card, deck) => {
        deck.add(copy_card(card));
        GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
    }
    var selector = new DeckSelector(GS.deck, finish);
    refresh_deck_select_screen(selector);
}
