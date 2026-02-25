function unlock_all_cards(){
    const cards = get_all_cards();
    for(var card of cards){
        GS.data.add_card(card().name);
    }
}