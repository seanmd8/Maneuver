function display_deck_to_remove(remaining){
    var message = `${boon_messages.clean_mind[0]}${remaining}${boon_messages.clean_mind[1]}`;
    display.display_message(UIIDS.deck_select_message, message);
    var finish = (card, deck) => {
        deck.remove(card.id);
        if(remaining > 1){
            display_deck_to_remove(remaining - 1);
        }
        else{
            GS.deck.deal();
            GS.refresh_deck_display();
            GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        }
    }
    var selector = new DeckSelector(GS.deck, finish);
    refresh_deck_select_screen(selector);
}