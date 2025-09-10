function update_journal_cards(){
    display.remove_children(UIIDS.journal_cards);
    display_basic_cards();
    display_common_cards();
    display_achievement_cards();
    display_boon_cards();
    display_confusion_cards();
    display_boss_cards();
}

function display_basic_cards(){
    var cards = cards_encountered(BASIC_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.basic, cards);
}
function display_common_cards(){
    var cards = cards_encountered(COMMON_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.common, cards);
}
function display_achievement_cards(){
    var cards = cards_locked(get_all_achievement_cards(), get_locked_achievement_cards());
    var cards = cards_encountered(cards, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.achievement, cards);
}
function display_boon_cards(){
    var cards = cards_encountered(BOON_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.boon, cards);
}
function display_confusion_cards(){
    var cards = cards_encountered(CONFUSION_CARDS, GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.confusion, cards);
}
function display_boss_cards(){
    var cards = cards_encountered(get_boss_cards(), GS.data.cards);
    display.journal_card_section(UIIDS.journal_cards, journal_card_headers.boss, cards);
}

function cards_encountered(cards, encountered){
    return cards.map((c) => {
        var card = c();
        if(card.name === card_names.symbol_locked){
            return card;
        }
        if(encountered.has(card.name)){
            return card;
        }
        return symbol_not_encountered_card();
    });
}
function cards_locked(cards, locked){
    return cards.map((c) => {
        var card = c();
        if(locked.find((l) => {
            return l().name === card.name;
        })){
            return symbol_locked_card;
        }
        return c;
    });
}