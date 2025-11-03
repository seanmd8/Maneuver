function unlock_all_cards(){
    const cards = [
        ...BASIC_CARDS,
        ...COMMON_CARDS,
        ...get_all_achievement_cards(),
        ...BOON_CARDS,
        ...CONFUSION_CARDS,
        ...get_boss_cards(),
    ];
    for(var card of cards){
        GS.data.add_card(card().name);
    }
}