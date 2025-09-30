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
    #hand_size;
    #min_deck_size;
    constructor(hand_size, minimum, cards = []){
        this.#decklist = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
        this.#hand_size = hand_size;
        this.#min_deck_size = minimum;
        for(var card of cards){
            this.#add_card(card());
        }
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
        for(var card of this.#decklist){
            if(card.per_floor !== undefined){
                card = card.per_floor();
                this.add_temp(card);
            }
            else{
                this.#library.push(card);
            }
        }
        this.#library = randomize_arr(this.#library);
        for(var i = 0; i < this.#hand_size; ++i){
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
            throw new Error(ERRORS.invalid_value);
        }
        if(this.#hand[hand_pos].temp === undefined || this.#hand[hand_pos].temp === false){
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
     * Discards all cards then draws up to max hand size.
     */
    discard_all(){
        for(var card of this.#hand){
            if(card.temp === undefined || card.temp === false){
                this.#discard_pile.push(card);
            }
        }
        this.#hand = [];
        while(this.#hand.length < this.#hand_size){
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
                this.#hand.push(top_card);
            }
        }
    }
    /**
     * Adds a new card to the decklist.
     * @param {Card} new_card Card to add.
     */
    add(new_card){
        this.#add_card(new_card);
        this.#check_three_kind_achievement(new_card.name);
        this.#check_jack_of_all_trades_achievement();
        GS.data.pick_card(new_card.name);
    }
    #add_card(new_card){
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
        this.#check_three_kind_achievement(new_card.name);
        this.#check_jack_of_all_trades_achievement();
        GS.data.add_card(new_card.name);
    }
    /**
     * Adds a new card to the library after giving it a temp tag.
     * Temp cards are removed when deal is called (at the end of the floor) or when used.
     * @param {Card} new_card Card to add.
     */
    add_temp(new_card){
        new_card.id = this.#id_count++;
        new_card.temp = true;
        this.#library.push(new_card);
        this.#library = randomize_arr(this.#library);
        GS.data.add_card(new_card.name);
    }
    get_hand_info(){
        var make_prep_move = function(card, hand_pos){
            return function(){
                if(!GS.check_lock_player_turn()){
                    return;
                }
                say(``);
                display_move_buttons(card, hand_pos);
            }
        }
        var card_row = [];
        for(var i = 0; i < this.#hand.length; ++i){
            let card = this.#hand[i];
            let background = [];
            if(card.temp){
                background.push(`${IMG_FOLDER.other}temporary_background.png`);
            }
            else{
                background.push(`${IMG_FOLDER.other}default_card_background.png`);
            }
            card_row.push({
                pic: card.pic,
                name: card.name,
                background,
                card: card,
                on_click: make_prep_move(card, i),
            });
        }
        return card_row;
    }
    /**
     * Function to count the number of cards remaining in your library.
     * @returns {number} cards remaining.
     */
    get_deck_count(){
        return this.#library.length;
    }
    /**
     * Returns the whole decklist.
     */
    get_deck_info(){
        return this.#decklist.map((card) => {
            return Object.assign({}, card);
        });
    }
    /**
     * Displays the whole discard pile.
     */
    get_discard_info(table){
        return [...this.#discard_pile];
    }
    /**
     * Displays the cards in your draw pile in order.
     */
    get_library_info(table){
        return reverse_arr(this.#library);
    }
    /**
     * Gets a random array of cards from the decklist with no repeats.
     * If the decklist is at minimum size, returns an empty array instead.
     * @param {number} size number of cards to get.
     * @returns {Card[]} The array of random cards.
     */
    get_rand_cards(size){
        if(this.#decklist.length <= this.#min_deck_size){
            return [];
        }
        return rand_no_repeats(this.#decklist, size);
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
                var card = this.#decklist[i];
                this.#decklist.splice(i, 1);
                if(card.evolutions !== undefined){
                    var next = randomize_arr(card.evolutions)[0]() ;
                    this.add(next);
                    if(next.evolutions === undefined){
                        GS.achieve(achievement_names.ancient_knowledge);
                    }
                }
                if(card.basic === true){
                    this.#check_remaining_basics_achievement();
                }
                GS.data.remove_card(card.name);
                return true;
            }
        }
        return false;
    }
    /**
     * @returns {number} The number of cards in the deck.
     */
    deck_size(){
        return this.#decklist.length;
    }
    /**
     * @returns {number} The minimum number of cards allowed in your deck.
     */
    deck_min(){
        return this.#min_deck_size;
    }
    /**
     * @param {number} change How much to add or remove from the minimum deck size.
     */
    alter_min(change){
        this.#min_deck_size += change;
    }
    /**
     *  @param {number} change How much to add or remove from the hand size.
     */
    alter_hand_size(change){
        this.#hand_size += change;
    }
    /**
     * Function to check if a card in the hand is an instant.
     * @param {number} hand_position The position of the card to check.
     * @returns {boolean} If it is an instant. 
     */
    is_instant(hand_position){
        if(this.#hand.length <= hand_position || hand_position < 0){
            throw new Error(ERRORS.invalid_value);
        }
        return this.#hand[hand_position].options.is_instant();
    }
    copy(){
        var new_deck = this.constructor(this.#hand_size, this.#min_deck_size);
        new_deck.#id_count = this.#id_count;
        new_deck.#decklist = this.#decklist;
        return new_deck;
    }
    #check_three_kind_achievement(name){
        var repeats = this.#decklist.filter((e) => {return e.name === name});
        if(GS !== undefined && repeats.length === 3){
            GS.achieve(achievement_names.triple);
        }
    }
    #check_remaining_basics_achievement(){
        var remaining = this.#decklist.filter((card) => {
            return card.basic === true;
        });
        if(remaining.length === 0){
            GS.achieve(achievement_names.beyond_the_basics);
        }
    }
    #check_jack_of_all_trades_achievement(){
        if(this.#decklist.length === 25){
            GS.achieve(achievement_names.jack_of_all_trades);
        }
    }
}