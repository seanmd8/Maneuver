/** @returns {MoveDeck} Returns a normal starting deck.*/
function make_starting_deck(){
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE);

    deck.add(basic_orthogonal());
    deck.add(basic_orthogonal());
    deck.add(basic_diagonal());
    deck.add(basic_diagonal());
    deck.add(basic_slice());
    deck.add(basic_slice());
    deck.add(short_charge_orthogonal());
    deck.add(jump());

    deck.deal();
    return deck;
}
/** @returns {MoveDeck} Returns a custom deck for testing.*/
function make_test_deck(test_cards){
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE);
    for(var card of test_cards){
        deck.add(card());
    }
    var size = test_cards.length;
    for(var i = 0; i < Math.max(4 - size, 1); ++i){
        deck.add(basic_orthogonal());
    }
    deck.add(basic_slice());
    deck.deal();
    return deck;
}