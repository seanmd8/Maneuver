// ----------------MoveDeck.js----------------
// The MoveDeck class contains the player's current deck of move cards.

class MoveDeck{
    /** @type {Card[]} The array of all cards they have.*/
    #decklist; // .
    /** @type {Card[]} The array of cards in their draw pile.*/
    #library; // 
    /** @type {Card[]} The array of cards curently usable.*/
    #hand; // 
    /** @type {Card[]} The array of cards they have used since they reshuffled.*/
    #discard_pile;
    /** @type {number} Used to give each card a unique id.*/
    #id_count;
    constructor(){
        this.#decklist = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
    }
    /**
     * Resets the deck to the decklist then deals a new hand.
     * @returns {void}
     */
    deal(){
        // Shuffles all cards together then deals a new hand.
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var i = 0; i < this.#decklist.length; ++i){
            var card = this.#decklist[i]
            if(card.per_floor !== undefined){
                card = card.per_floor();
                this.add_temp(card);
            }
            else{
                this.#library.push(card);
            }
        }
        this.#library = randomize_arr(this.#library);
        for(var i = 0; i < HAND_SIZE; ++i){
            var top_card = this.#library.pop();
            if(top_card !== undefined){
                this.#hand.push(top_card);
            }
        }
    }
    /**
     * Discards the card at the given position in the hand, then draws a new one.
     * @param {number} hand_pos The position of the card which should be discarded.
     */
    discard(hand_pos){
        // Makes player discard the card at position x from their hand and draw a new one. 
        // If the library is empty, it will first shuffle in the discard. 
        // Throws an error if x doens't correspond to a card in hand.
        if(hand_pos >= this.#hand.length || hand_pos < 0){
            throw new Error(`hand out of bounds`);
        }
        if(!(this.#hand[hand_pos].temp !== undefined && this.#hand[hand_pos].temp === true)){
            this.#discard_pile.push(this.#hand[hand_pos]);
        }
        if(this.#library.length === 0){
            var top_discard = this.#discard_pile.pop();
            while(top_discard !== undefined){
                this.#library.push(top_discard);
                top_discard = this.#discard_pile.pop();
            }
            this.#library = randomize_arr(this.#library);
        }
        var top_card = this.#library.pop();
        if(top_card !== undefined){
            this.#hand[hand_pos] = top_card;
        }
    }
    /**
     * Adds a new card to the decklist.
     * @param {Card} new_card Card to add.
     */
    add(new_card){
        new_card.id = this.#id_count;
        this.#id_count++;
        this.#decklist.push(new_card);
        if(new_card.per_floor !== undefined){
            // If the card can only be used once per floor, add a temp copy instead.
            var temp_card = new_card.per_floor();
            this.add_temp(temp_card);
        }
        else{
            this.#library.push(new_card);
        }
        this.#library = randomize_arr(this.#library);
    }
    /**
     * Adds a new card to the library after giving it a temp tag.
     * Temp cards are removed when deal is called (at the end of the floor) or when used.
     * @param {Card} new_card Card to add.
     */
    add_temp(new_card){
        new_card.id = this.#id_count;
        new_card.temp = true;
        this.#id_count++;
        this.#library.push(new_card);
        this.#library = randomize_arr(this.#library);
    }
    /**
     * Displays the hand.
     * @param {string} table Where it should be dispalyed.
     */
    display_hand(table){
        // Displays the hand to the given table.
        display.clear_tb(table);
        var make_prep_move = function(deck){
            return function(card, hand_pos){
                if(!GS.check_lock_player_turn()){
                    return;
                }
                var extra_info = temp_card_info(card);
                display.select(UIIDS.hand_display, 0, hand_pos.x);
                card.options.show_buttons(UIIDS.move_buttons, hand_pos.x, extra_info);
                var deck = deck;
            }
        }
        var card_background = function(tile, location){
            var backgrounds = [];
            if(tile.temp){
                backgrounds.push(`${IMG_FOLDER.other}temporary_background.png`)
            }
            else{
                backgrounds.push(`${IMG_FOLDER.other}default_card_background.png`)
            }
            return backgrounds;
        }
        var explain_blank_moves = function(){
            display.display_message(UIIDS.display_message, blank_moves_message);
        }
        display.add_tb_row(table, this.#hand, CARD_SCALE, make_prep_move(this), card_background);
        display.display_message(UIIDS.deck_count, `${this.#library.length}`);
        display.add_on_click(UIIDS.move_info, explain_blank_moves);
    }
    /**
     * Displays the whole decklist
     * @param {string} table Where it should be displayed.
     */
    display_all(table){
        display.display_message(UIIDS.current_deck, `${current_deck}${MIN_DECK_SIZE}):`)
        for(var i = 0; i < Math.ceil(this.#decklist.length / DECK_DISPLAY_WIDTH); ++i){
            display.add_tb_row(table, this.#decklist.slice(i * DECK_DISPLAY_WIDTH, (i + 1) * DECK_DISPLAY_WIDTH), CARD_SCALE)
            
        }
    }
    /**
     * Gets a random array of cards from the decklist with no repeats.
     * If the decklist is at minimum size, returns an empty array instead.
     * @param {number} size number of cards to get.
     * @returns {Card[]} The array of random cards.
     */
    get_rand_cards(size){
        if(this.#decklist.length <= MIN_DECK_SIZE){
            return [];
        }
        return rand_no_repeates(this.#decklist, size);
    }
    /**
     * Removes a card from the decklist.
     * @param {number} id The ID of the card to remove.
     * @returns {boolean} Returns true if the card was removed and false otherwise.
     */
    remove(id){
        // Removes the card with the given id from the deck.
        // Returns false if it could not be found.
        for(var i = 0; i < this.#decklist.length; ++i){
            if(this.#decklist[i].id === id){
                this.#decklist[i] = this.#decklist[this.#decklist.length - 1];
                this.#decklist.pop();
                return true;
            }
        }
        return false;
    }
}

/**
 * Function to give the correct messages if a card is temporary or only usable once per floor.
 * @param {Card} card The card to check.
 * @returns {String} The correct string message.
 */
function temp_card_info(card){
    if(card.per_floor !== undefined){
        return `${move_types.per_floor_card_message}\n`;
    }
    if(card.temp){
        return `${move_types.temp_card_message}\n`;
    }
    return ``;
}
