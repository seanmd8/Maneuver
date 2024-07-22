// ----------------GameState.js----------------
// File containing a class to control the general flow of the game.


class GameState{
    /** @type {GameMap} The map of the current floor.*/
    map;
    /** @type {MoveDeck} The player's deck of cards.*/
    deck;
    boons;
    #player_turn_lock;
    #text_log;
    constructor(){
        // Starts the game on load.
        this.setup();
    }
    /** 
     * Function to set up or reset the game.
     * @returns {void} 
     */
    setup(){
        // Function ran on page load or on restart to set up the game.
        this.#text_log = [];
        this.boons = new BoonTracker(BOON_LIST);
        var start = randomize_arr(STARTING_AREA)[0]();
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start);
        this.deck = STARTING_DECK();

        var starting_text = `${start.description}\n${welcome_message}`;
        say(starting_text, false);
        this.record_message(starting_text);
        display.display_message(UIIDS.hand_label, `${hand_label_text}`);
        display.display_message(UIIDS.move_label, `${move_label_text}`);
        create_sidebar();

        // Prep map
        for(var i = 0; i < STARTING_ENEMY_AMOUNT; ++i){
            this.map.spawn_safely(STARTING_ENEMY(), SAFE_SPAWN_ATTEMPTS, true);
        }
        for(var i = 0; i < SECOND_STARTING_ENEMY_AMOUNT; ++i){
            this.map.spawn_safely(SECOND_STARTING_ENEMY(), SAFE_SPAWN_ATTEMPTS, true);
        }
        for(var i = 0; i < STARTING_CHEST_AMOUNT; ++i){
            var chest = chest_tile();
            add_boon_to_chest(chest, STARTING_CHEST_CONTENTS());
            this.map.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        this.map.display();
        this.map.display_stats(UIIDS.stats);

        this.refresh_deck_display();
        display.display_message(UIIDS.shop_instructions, mod_deck);
        display.swap_screen(DISPLAY_DIVISIONS, UIIDS.game_screen);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        this.#player_turn_lock = true;
    }
    /** 
     * Handles the effects of using a card, then passes to the enemies' turn.
     * Takes the appropriate actions if
     *      -The floor is completed
     *      -The player dies
     *      -The enemies' turn ends early
     * @param {PlayerCommand[]} behavior A set of commands to be executed one by one.
     * @param {number} hand_pos The position of the card that the player used in their hand.
     */
    async player_turn(behavior, hand_pos){
        // Function to execute the outcome of the player's turn.
        if(!this.lock_player_turn()){
            return;
        }
        display.remove_children(UIIDS.move_buttons);
        this.map.clear_marked();
        say(``, false);
        try{
            // The repetition boon will double movements one in every 3 turns.
            var repetition_count = GS.boons.has(boon_names.repetition);
            var repeat = (repetition_count > 0 && GS.map.get_turn_count() % 3 < repetition_count) ? 2 : 1;
            for(var i = 0; i < repeat; ++i){
                for(var action of behavior){
                    // Does each valid command in the behavior array.
                    this.player_action(action);
                }
            }
            var is_instant = this.deck.is_instant(hand_pos);
            if(this.boons.has(boon_names.spontaneous) > 0 && !is_instant){
                this.deck.discard_all();
            }
            else{
                this.deck.discard(hand_pos);
            }
            this.map.display();
            await delay(ANIMATION_DELAY);
            if(is_instant){
                this.refresh_deck_display();
                this.unlock_player_turn();
                this.map.display_stats(UIIDS.stats);
                this.map.display();
                this.unlock_player_turn();
                return;
            }
            await this.map.enemy_turn();
            await this.prep_turn();
        }
        catch (error){
            var m = error.message;
            if(m === ERRORS.floor_complete){
                // If the player has reached the end of the floor.
                this.map.display_stats(UIIDS.stats);
                this.enter_shop();
            }
            else if(m === ERRORS.game_over){
                // If the player's health reached 0
                this.game_over(error.cause.message);
            }
            else if(m === ERRORS.pass_turn){
                // If the enemies' turn was interrupted,
                // prep for player's next turn.
                this.prep_turn();
            }
            else{
                throw error;
            }
        }
    }
    /**
     * Handles an individual action of the player.
     * Throws an error if a command of the wrong type is sent in.
     * @param {PlayerCommand} action The command to be followed.
     * @returns {boolean} returns true if the action was instant, false otherwise.
     */
    player_action(action){
        switch(action.type){
            case `attack`:
                if(this.boons.has(boon_names.pacifism)){
                    this.map.player_stun(action.change);
                    this.map.player_stun(action.change);
                }
                else{
                    this.map.player_attack(action.change);
                }
                break;
            case `move`:
                var moved = this.map.player_move(action.change);
                if(!moved && GS.boons.has(boon_names.spiked_shoes)){
                    this.map.player_attack(action.change);
                }
                
                break;
            case `teleport`:
                this.map.player_teleport(action.change);
                break;
            case `stun`:
                this.map.player_stun(action.change);
                break;
            case `move_until`:
                var spiked_shoes = GS.boons.has(boon_names.spiked_shoes);
                while(this.map.player_move(action.change)){};
                if(spiked_shoes){
                    this.map.player_attack(action.change);
                }
                break;
            case `heal`:
                this.map.player_heal(action.change, 1);
                break;
            default:
                throw new Error(ERRORS.invalid_value);
        }
        return false;
    }
    /** 
     * Sets up the next floor then leaves the shop.
     * @returns {void} 
     */
    async new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats(UIIDS.stats);
        this.map.display();
        this.deck.deal();
        this.refresh_deck_display();
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
        await delay(ANIMATION_DELAY);
        this.map.display();
        this.unlock_player_turn();
    }
    /** 
     * Preps and swaps to the shop screen.
     * @returns {void} 
     */
    enter_shop(){
        // Gives the player the option to add or remove a card from their deck.
        // Their deck contents are also displayed.
        // Options to remove cards will not be displayed if the deck is at the minimum size already.
        display.remove_children(UIIDS.move_buttons);
        display.remove_children(UIIDS.add_card);
        display.remove_children(UIIDS.remove_card);
        display.remove_children(UIIDS.display_deck);
        this.deck.display_all(UIIDS.display_deck);
        this.#generate_add_row(UIIDS.add_card);
        this.#generate_remove_row(UIIDS.remove_card);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.shop);
    }
    /** 
     * Creates the row of cards that can be added to the deck.
     * @param {string} table The table where it should be displayed.
    */
    #generate_add_row(table){
        // Get card choices
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        var add_list_generators = rand_no_repeates(CARD_CHOICES, amount);
        var chance_of_rare = random_num(4);
        if(chance_of_rare < add_list_generators.length){
            var rare = rand_no_repeates(RARE_CARD_CHOICES, 1);
            add_list_generators[chance_of_rare] = rare[0];
        }
        var add_list = add_list_generators.map(g => g());
        add_list.unshift(add_card_symbol())
        // Display cards
        var make_add_card = function(card, position, gamestate){
            return function(){
                if(position > 0){
                    gamestate.deck.add(card);
                    gamestate.new_floor();
                }
            }
        }
        var row = [];
        for(var i = 0; i < add_list.length; ++i){
            let card = add_list[i];
            row.push({
                name: card.name,
                pic: card.pic,
                on_click: make_add_card(card, i, this)
            })
        }
        display.add_tb_row(table, row, CARD_SCALE);
    }
    /** 
     * Creates the row of cards that can be removed from the deck.
     * @param {string} table The table where it should be displayed.
     * */
    #generate_remove_row(table){
        var amount = ADD_CHOICE_COUNT + GS.boons.has(boon_names.picky_shopper);
        var remove_list = this.deck.get_rand_cards(amount);
        if(remove_list.length > 0){
            remove_list.unshift(remove_card_symbol());
        }
        else{
            remove_list.unshift(deck_at_minimum_symbol());
        }
        var make_remove_card = function(card, position, gamestate){
            return function(){
                if(position > 0){
                    gamestate.deck.remove(card.id);
                    gamestate.new_floor();
                }
            }
        }
        var row = [];
        for(var i = 0; i < remove_list.length; ++i){
            let card = remove_list[i];
            row.push({
                name: card.name,
                pic: card.pic,
                on_click: make_remove_card(card, i, this)
            });
        }
        display.add_tb_row(table, row, CARD_SCALE);
    }
    /**
     * Called when the player dies. Gives the option to restart.
     * @param {string} cause Cause of death.
     */
    game_over(cause){
        // Tells the user the game is over, prevents them fro m continuing, tells them the cause
        // and gives them the chance to retry.
        this.map.display();
        display.remove_children(UIIDS.hand_display);
        display.remove_children(UIIDS.move_buttons);
        say(`${game_over_message}${cause}.`);
        display.remove_children(UIIDS.move_buttons);
        var restart = function(game){
            return function(message, position){
                display.remove_children(UIIDS.retry_button);
                game.setup();
            };
        }
        var restart_message = [{
            description: retry_message,
            on_click: restart(this)
        }]
        display.add_button_row(UIIDS.retry_button, restart_message);
    }
    /**
     * Adds a temporary card to the player's deck.
     * @param {Card} card The card to be added.
     */
    give_temp_card(card){
        if(GS.boons.has(boon_names.fleeting_thoughts)){
            card.options.make_instant();
        }
        this.deck.add_temp(card);
    }
    /** 
     * Sets up the player's turn.
     * @returns {Promise<void>}
     */
    async prep_turn(){
        this.map.resolve_events();
        this.map.display();
        await delay(ANIMATION_DELAY);
        this.map.display();
        this.refresh_deck_display();
        this.map.display_stats(UIIDS.stats);
        this.unlock_player_turn();
    }
    /** 
     * Ensures the player can't make moves during the enemies' turn using a lock.
     * @returns {Boolean} True if the lock hasn't been used yet, false otherwise.
     */
    lock_player_turn(){
        if(this.#player_turn_lock){
            this.#player_turn_lock = false;
            return true;
        }
        return false;
    }
    /** 
     * Returns the lock so the player can take their turn.
     */
    unlock_player_turn(){
        this.#player_turn_lock = true;
    }
    /** 
     * Ensures the player can't make moves during the enemies' turn.
     * @returns {Boolean} True if the lock hasn't been used yet, false otherwise.
     */
    check_lock_player_turn(){
        return this.#player_turn_lock;
    }
    /**
     * Records a message in the text log, then displays the text log.
     * @param {string} msg The message to record.
     */
    record_message(msg){
        this.#text_log.push(msg);
        this.display_messages(UIIDS.text_scroll);
    }
    /**
     * Displays all messages in the text log.
     * @param {string} location Where to display to.
     */
    display_messages(location){
        display.remove_children(location);
        display.create_stacked_p(location, reverse_arr(this.#text_log));
    }
    /**
     * Displays the hand, discard pile, and deck to their proper locations.
     */
    refresh_deck_display(){
        this.deck.display_hand(UIIDS.hand_display);
        this.deck.display_discard(UIIDS.discard_pile_table);
        this.deck.display_deck_order(UIIDS.deck_order_table);
    }
    /**
     * Displays the hand, discard pile, and deck to their proper locations.
     */
    refresh_boon_display(){
        this.boons.display(UIIDS.boon_list_table);
        this.boons.display_lost(UIIDS.removed_boon_table);
    }
}


