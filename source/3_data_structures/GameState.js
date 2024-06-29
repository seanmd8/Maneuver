// ----------------GameState.js----------------
// File containing a class to control the general flow of the game.


class GameState{
    /** @type {GameMap} The map of the current floor.*/
    map;
    /** @type {MoveDeck} The player's deck of cards.*/
    deck;
    #player_turn_lock;
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
        var start = randomize_arr(STARTING_AREA)[0]();
        display.display_message(UIIDS.display_message, `${start.description}\n${welcome_message}`);
        display.display_message(UIIDS.hand_label, `${hand_label_text}`);
        display.display_message(UIIDS.move_label, `${move_label_text}`);
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start); 
        for(var i = 0; i < STARTING_ENEMY_AMOUNT; ++i){
            this.map.spawn_safely(STARTING_ENEMY(), SAFE_SPAWN_ATTEMPTS, true);
        }
        for(var i = 0; i < SECOND_STARTING_ENEMY_AMOUNT; ++i){
            this.map.spawn_safely(SECOND_STARTING_ENEMY(), SAFE_SPAWN_ATTEMPTS, true);
        }
        this.map.display();
        this.map.display_stats(UIIDS.stats);
        this.deck = STARTING_DECK();
        this.deck.display_hand(UIIDS.hand_display);
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
        display.display_message(UIIDS.display_message, ``);
        this.map.clear_marked();
        try{
            var is_instant = false;
            for(var i = 0; i < behavior.length; ++i){
                // Does each valid command in the behavior array.
                is_instant = this.player_action(behavior[i]);
            }
            display.clear_tb(UIIDS.move_buttons);
            this.deck.discard(hand_pos);
            this.map.display();
            await delay(ANIMATION_DELAY);
            if(is_instant){
                this.deck.display_hand(UIIDS.hand_display);
                this.map.display_stats(UIIDS.stats);
                this.map.display();
                return;
            }
            await this.map.enemy_turn();
            await this.prep_turn();
        }
        catch (error){
            var m = error.message;
            if(m === `floor complete`){
                // If the player has reached the end of the floor.
                this.map.display_stats(UIIDS.stats);
                this.enter_shop();
            }
            else if(m === `game over`){
                // If the player's health reached 0
                this.game_over(error.cause.message);
            }
            else if(m === `pass to player`){
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
                this.map.player_attack(action.change);
                break;
            case `move`:
                this.map.player_move(action.change);
                break;
            case `teleport`:
                this.map.player_teleport(action.change);
                break;
            case `instant`:
                this.unlock_player_turn();
                return true;
            case `stun`:
                if(point_equals(action.change, new Point(0, 0))){
                    confuse_player();
                }
                else{
                    this.map.player_stun(action.change);
                }
                break;
            case `move_until`:
                while(this.map.player_move(action.change)){};
                break;
            case `heal`:
                this.map.player_heal(action.change, 1);
                break;
            default:
                throw new Error(`invalid player action type`);
        }
        return false;
    }
    /** 
     * Sets up the next floor then leaves the shop.
     * @returns {void} 
     */
    new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats(UIIDS.stats);
        this.map.display();
        this.deck.deal();
        this.deck.display_hand(UIIDS.hand_display);
        display.swap_screen(GAME_SCREEN_DIVISIONS, UIIDS.stage);
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
        display.clear_tb(UIIDS.move_buttons);
        display.clear_tb(UIIDS.add_card);
        display.clear_tb(UIIDS.remove_card);
        display.clear_tb(UIIDS.display_deck);
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
        var add_list_generators = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
        var chance_of_rare = random_num(4);
        if(chance_of_rare < add_list_generators.length){
            var rare = rand_no_repeates(RARE_CARD_CHOICES, 1);
            add_list_generators[chance_of_rare] = rare[0];
        }
        var add_list = [];
        for(var i = 0; i < add_list_generators.length; ++i){
            add_list[i] = add_list_generators[i]();
        }
        add_list.unshift(add_card_symbol())
        var make_add_card = function(gamestate){
            return function(card, position){
                if(position.x > 0){
                    gamestate.deck.add(card);
                    gamestate.new_floor();
                }
            }
        }
        display.add_tb_row(table, add_list, CARD_SCALE, make_add_card(this));
    }
    /** 
     * Creates the row of cards that can be removed from the deck.
     * @param {string} table The table where it should be displayed.
     * */
    #generate_remove_row(table){
        var remove_list = this.deck.get_rand_cards(REMOVE_CHOICE_COUNT);
        if(remove_list.length > 0){
            remove_list.unshift(remove_card_symbol());
        }
        else{
            remove_list.unshift(deck_at_minimum_symbol());
        }
        var make_remove_card = function(gamestate){
            return function(card, position){
                if(position.x > 0){
                    gamestate.deck.remove(card.id);
                    gamestate.new_floor();
                }
            }
        }
        display.add_tb_row(table, remove_list, CARD_SCALE, make_remove_card(this));
    }
    /**
     * Called when the player dies. Gives the option to restart.
     * @param {string} cause Cause of death.
     */
    game_over(cause){
        // Tells the user the game is over, prevents them fro m continuing, tells them the cause
        // and gives them the chance to retry.
        this.map.display();
        display.clear_tb(UIIDS.hand_display);
        display.clear_tb(UIIDS.move_buttons);
        display.display_message(UIIDS.display_message, `${game_over_message}${cause}.`);
        display.clear_tb(UIIDS.move_buttons);
        var restart = function(game){
            return function(message, position){
                display.clear_tb(UIIDS.retry_button);
                game.setup();
            };
        }
        var restart_message = [{
            description: retry_message
        }]
        display.add_button_row(UIIDS.retry_button, restart_message, restart(this));
    }
    /**
     * Adds a temporary card to the player's deck.
     * @param {Card} card The card to be added.
     */
    give_temp_card(card){
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
        this.deck.display_hand(UIIDS.hand_display);
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
}


