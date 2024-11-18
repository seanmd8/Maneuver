// ToDo
var imports = require('../../ManeuverTest.js');


describe(`MoveDeck`, () => {
    // Imports used or being tested.
    const MoveDeck = imports.MoveDeck;
    const card_1 = imports.basic_horizontal;   
    const card_2 = imports.basic_slice;   

    // Common testing vars.
    var deck;
    
  
    beforeEach(() => {
        deck = new MoveDeck(3, 5);
    });

    it(`instantiates correctly`, () => {
        expect(deck.deck_size()).toBe(0);
    })

    it(`adds cards correctly`, () => {
        deck.add(card_1());
        deck.add(card_2());
        expect(deck.deck_size()).toBe(2);
        var list = deck.get_deck_info();
        expect(list[0].name).toBe(card_1().name);
        expect(list[1].name).toBe(card_2().name);
    })

    it(`removes cards properly`, () => {
        deck.add(card_1());
        deck.add(card_2());
        expect(deck.deck_size()).toBe(2);
        deck.remove(1);
        expect(deck.deck_size()).toBe(1);
        deck.remove(0);
        expect(deck.deck_size()).toBe(0);
        deck.add(card_2());
        expect(deck.deck_size()).toBe(1);
        deck.remove(2);
        expect(deck.deck_size()).toBe(0);
    })

    it(`deals a new hand`, () => {
        for(var i = 0; i < 5; ++i){
            deck.add(card_1());
        }
        deck.deal();
        var hand = deck.get_hand_info();
        expect(hand.length).toBe(3);
        for(var card of hand){
            expect(card.name).toBe(card_1().name);
        }
    })

    it(`discards cards properly`, () => {
        for(var i = 0; i < 5; ++i){
            deck.add(card_1());
        }
        deck.deal();
        var hand = deck.get_hand_info();
        var first_id = hand[0].id;
        var last_id = hand[2].id;
        deck.discard(0);
        expect(deck.get_hand_info()[0].id === first_id).toBe(false);
        deck.discard(2);
        expect(deck.get_hand_info()[2].id === last_id).toBe(false);
    })

    it(`shuffles deck properly`, () => {
        
    })

    it(`adds temp card properly`, () => {
        
    })

    it(`temp cards removed when discarded`, () => {
        
    })

    it(`temp cards removed when dealt`, () => {
        
    })

    it(`gets a random group of cards`, () => {
        
    })

    it(`limits the cards returned if larger than deck`, () => {
        
    })

    it(`fails to get cards if minimum deck size reached`, () => {
        
    })
    
    it(`gets minimum deck size`, () => {
        
    })

    it(`changes minimum deck size`, () => {
        
    })

    it(`alters hand size`, () => {
        
    })
        
    it(`checks if a card is instant`, () => {
        
    })

    // Test display functions
});
