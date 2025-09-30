/** @returns {MoveDeck} Returns a normal starting deck.*/
function make_starting_deck(){
    var cards = [
        basic_orthogonal,
        basic_orthogonal,
        basic_diagonal,
        basic_diagonal,
        basic_slice,
        basic_slice,
        short_charge_orthogonal,
        jump,
    ];
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE, cards);

    deck.deal();
    return deck;
}
/** @returns {MoveDeck} Returns a custom deck for testing.*/
function make_test_deck(test_cards){
    var size = test_cards.length;
    for(var i = 0; i < Math.max(4 - size, 1); ++i){
        test_cards.push(basic_orthogonal);
    }
    test_cards.push(basic_slice);
    var deck = new MoveDeck(HAND_SIZE, MIN_DECK_SIZE, test_cards);
    deck.deal();
    return deck;
}