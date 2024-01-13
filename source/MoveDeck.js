// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

class MoveDeck{
    #list; // The list of all cards they have.
    #library; // The list of cards in their draw pile.
    #hand; // The list of cards curently usable.
    #discard_pile; // The list of cards they have used since they reshuffled.
    #id_count; // Used to give each card a unique id.
    constructor(){
        this.#list = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
    }
    /**
     * @returns {undefined}
     */
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var i = 0; i < this.#list.length; ++i){
            this.#library.push(this.#list[i]);
        }
        this.#library = randomize_arr(this.#library);
        for(var i = 0; i < HAND_SIZE; ++i){
            this.#hand.push(this.#library.pop());
        }
    }
    /**
     * @param {number} hand_pos 
     */
    discard(hand_pos){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(hand_pos >= this.#hand.length || hand_pos < 0){
            throw new Error(`hand out of bounds`);
        }
        if(this.#library.length === 0){
            while(this.#discard_pile.length != 0){
                this.#library.push(this.#discard_pile.pop());
            }
            this.#library = randomize_arr(this.#library);
        }
        if(!(this.#hand[hand_pos].temp !== undefined && this.#hand[hand_pos].temp === true)){
            this.#discard_pile.push(this.#hand[hand_pos]);
        }
        this.#hand[hand_pos] = this.#library.pop();
    }
    /**
     * @param {Card} card 
     */
    add(card){
        // Adds a new card to the list.
        card.id = this.#id_count;
        this.#id_count++;
        this.#list.push(card);
    }
    /**
     * @param {Card} card 
     */
    add_temp(card){
        // Adds a temp card which will be removed at the end of the floor by only adding it to the library, not the list
        card.id = this.#id_count;
        card.temp = true;
        this.#id_count++;
        this.#library.push(card);
        this.#library = randomize_arr(this.#library);
    }
    /**
     * @param {string} table 
     */
    display_hand(table){
        // Displays the hand to the given table.
        display.clear_tb(table);
        var make_prep_move = function(deck){
            return function(card, hand_pos){
                display.select(ui_id.hand_display, 0, hand_pos);
                card.options.show_buttons(ui_id.move_buttons, hand_pos);
                var deck = deck;
            }
        }
        display.add_tb_row(table, this.#hand, CARD_SCALE, make_prep_move(this));
    }
    /**
     * @param {string} table 
     */
    display_all(table){
        // Displays the deck list to the given table.
        display.display_message(ui_id.current_deck, `${current_deck}${MIN_DECK_SIZE}):`)
        for(var i = 0; i < Math.ceil(this.#list.length / DECK_DISPLAY_WIDTH); ++i){
            display.add_tb_row(table, this.#list.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH) ,CARD_SCALE)
            
        }
    }
    /**
     * @param {number} size 
     * @returns {Card[]}
     */
    get_rand_cards(size){
        if(this.#list.length <= MIN_DECK_SIZE){
            return [];
        }
        return rand_no_repeates(this.#list, size);
    }
    /**
     * @param {number} id 
     * @returns {boolean}
     */
    remove(id){
        // Removes the card with the given id from the deck.
        // Returns false if it could not be found.
        for(var i = 0; i < this.#list.length; ++i){
            if(this.#list[i].id === id){
                this.#list[i] = this.#list[this.#list.length - 1];
                this.#list.pop();
                return true;
            }
        }
        return false;
    }
}
