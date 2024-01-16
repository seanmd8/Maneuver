// ----------------GameState.js----------------
// File containing a class to control the general flow of the game.


class GameState{
    /** @type {GameMap} The map of the current floor.*/
    map;
    /** @type {MoveDeck} The player's deck of cards.*/
    deck;
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
        var start = STARTING_AREA();
        display.display_message(ui_id.title, game_title);
        display.display_message(ui_id.display_message, `${start.description}\n${welcome_message}`);
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start); 
        this.map.add_tile(STARTING_ENEMY());
        this.map.display();
        this.map.display_stats(ui_id.stats);
        this.deck = STARTING_DECK();
        this.deck.display_hand(ui_id.hand_display);
        display.display_message(ui_id.shop_instructions, mod_deck);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.game_screen);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.stage);
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
        display.display_message(ui_id.display_message, ``);
        this.map.clear_marked();
        try{
            for(var i = 0; i < behavior.length; ++i){
                // Does each valid command in the behavior array.
                this.player_action(behavior[i]);
            }
            display.clear_tb(ui_id.move_buttons);
            this.deck.discard(hand_pos);
            this.map.display();
            await delay(ANIMATION_DELAY);
            await this.map.enemy_turn();
            this.prep_turn();
        }
        catch (error){
            var m = error.message;
            if(m === `floor complete`){
                // If the player has reached the end of the floor.
                this.map.display_stats(ui_id.stats);
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
     */
    player_action(action){
        if(action.type === `attack`){
            this.map.player_attack(action.change);
        }
        else if(action.type === `move`){
            this.map.player_move(action.change);
        }
        else{
            throw new Error(`invalid action type`);
        }
    }
    /** 
     * Sets up the next floor then leaves the shop.
     * @returns {void} 
     */
    new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats(ui_id.stats);
        this.map.display();
        this.deck.deal();
        this.deck.display_hand(ui_id.hand_display);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.stage);
    }
    /** 
     * Preps and swaps to the shop screen.
     * @returns {void} 
     */
    enter_shop(){
        // Gives the player the option to add or remove a card from their deck.
        // Their deck contents are also displayed.
        // Options to remove cards will not be displayed if the deck is at the minimum size already.
        display.clear_tb(ui_id.move_buttons);
        display.clear_tb(ui_id.add_card);
        display.clear_tb(ui_id.remove_card);
        display.clear_tb(ui_id.display_deck);
        this.deck.display_all(ui_id.display_deck);
        this.#generate_add_row(ui_id.add_card);
        this.#generate_remove_row(ui_id.remove_card);
        display.swap_screen(GAME_SCREEN_DIVISIONS, ui_id.shop);
    }
    /** 
     * Creates the row of cards that can be added to the deck.
     * @param {string} table The table where it should be displayed.
    */
    #generate_add_row(table){
        var add_list_generators = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
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
        display.clear_tb(ui_id.hand_display);
        display.clear_tb(ui_id.move_buttons);
        display.display_message(ui_id.display_message, `${game_over_message}${cause}.`);
        display.clear_tb(ui_id.move_buttons);
        var restart = function(game){
            return function(message, position){
                display.clear_tb(ui_id.move_buttons);
                game.setup();
            };
        }
        var restart_message = [{
            description: retry_message
        }]
        display.add_button_row(ui_id.move_buttons, restart_message, restart(this));
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
        this.deck.display_hand(ui_id.hand_display);
        this.map.display_stats(ui_id.stats);
    }
}


