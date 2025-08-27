// ----------------GameState.js----------------
// File containing a class to control the general flow of the game.


class GameState{
    map;
    deck;
    boons;
    data;
    #player_turn_lock;
    #text_log;
    constructor(){
        // Starts the game on load.
        var init = init_settings();
        this.data = new SaveData(init.load, init.save);
    }
    /** 
     * Function to set up or reset the game.
     * @returns {void} 
     */
    setup(){
        var init = init_settings();
        // Function ran on page load or on restart to set up the game.
        this.#text_log = [];
        this.boons = new BoonTracker(BOON_LIST);
        var start = randomize_arr(init.area)[0]();
        this.map = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start);
        this.deck = init.make_deck();

        var starting_text = `${start.description}\n${welcome_message}`;
        say_record(starting_text);
        display.display_message(UIIDS.hand_label, `${hand_label_text}`);
        display.display_message(UIIDS.move_label, `${move_label_text}`);
        create_sidebar();

        // Prep map
        for(var enemy of init.enemies){
            this.map.spawn_safely(enemy(), SAFE_SPAWN_ATTEMPTS, true);
        }
        for(var boon of init.chests){
            var chest = chest_tile();
            add_boon_to_chest(chest, boon());
            this.map.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        display_map(this.map);
        this.map.display_stats(UIIDS.stats);

        this.refresh_deck_display();
        display.display_message(UIIDS.shop_instructions, mod_deck);
        DISPLAY_DIVISIONS.swap(UIIDS.game_screen);
        GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
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
        say(``);
        if(GS.boons.has(boon_names.thick_soles)){
            GS.map.get_player().tags.add(TAGS.invulnerable);
        }
        try{
            // The repetition boon will double movements 1 in every 3 turns.
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
            if(GS.boons.has(boon_names.thick_soles)){
                GS.map.get_player().tags.remove(TAGS.invulnerable);
            }
            display_map(this.map);
            await delay(ANIMATION_DELAY);
            if(is_instant){
                this.refresh_deck_display();
                this.unlock_player_turn();
                this.map.display_stats(UIIDS.stats);
                display_map(this.map);
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
            case action_types.attack:
                var attack_count = 1;
                var stun_count = 0;
                var target = this.map.get_player_location().plus(action.change);
                if(this.boons.has(boon_names.sniper)){
                    var distance = Math.max(Math.abs(action.change.x), Math.abs(action.change.y));
                    attack_count += Math.max(0, distance - 1);
                }
                if(this.boons.has(boon_names.frenzy) && this.map.get_player().health === 1){
                    attack_count *= 2;
                }
                if( // Dazing Blows
                    this.boons.has(boon_names.dazing_blows) && 
                    !action.change.is_origin() &&
                    this.map.is_in_bounds(target) &&
                    !this.map.get_tile(target).tags.has(TAGS.boss)
                ){
                    stun_count += 1
                }
                if( // Pacifism
                    this.boons.has(boon_names.pacifism) && 
                    !action.change.is_origin()
                ){
                    stun_count += 2 * attack_count;
                    attack_count = 0;
                }
                for(var i = 0; i < attack_count; ++i){
                    this.map.player_attack(action.change);
                }
                for(var i = 0; i < stun_count; ++i){
                    this.player_action(pstun(action.change.x, action.change.y));
                }
                break;
            case action_types.move:
                var previous_location = this.map.get_player_location();
                var moved = this.map.player_move(action.change);
                if(!moved && GS.boons.has(boon_names.spiked_shoes)){
                    this.player_action(pattack(action.change.x, action.change.y));
                }
                if(moved && chance(GS.boons.has(boon_names.slime_trail), 2)){
                    this.map.add_tile(corrosive_slime_tile(), previous_location);
                }
                break;
            case action_types.teleport:
                try{
                    this.map.player_teleport(action.change);
                }
                catch(error){
                    if(error.message !== ERRORS.map_full){
                        throw error;
                    }
                }
                break;
            case action_types.stun:
                this.map.player_stun(action.change);
                break;
            case action_types.move_until:
                var spiked_shoes = GS.boons.has(boon_names.spiked_shoes);
                var previous_location = this.map.get_player_location();
                while(this.map.player_move(action.change)){
                    if(chance(GS.boons.has(boon_names.slime_trail), 2)){
                        this.map.add_tile(corrosive_slime_tile(), previous_location);
                    }
                    previous_location = this.map.get_player_location();
                };
                if(spiked_shoes){
                    this.player_action(pattack(action.change.x, action.change.y));
                }
                break;
            case action_types.attack_until:
                var i = 0;
                do{
                    i += 1;
                    var p_location = this.map.get_player_location();
                    var target = action.change.times(i);
                    this.player_action(pattack(target.x, target.y));
                }while(this.map.is_in_bounds(p_location.plus(target)));
                break;
            case action_types.heal:
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
        display_map(this.map);
        this.deck.deal();
            if(GS.boons.has(boon_names.vicious_cycle) > 0){
            apply_vicious_cycle(this.deck);
        }
        this.refresh_deck_display();
        GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        await delay(ANIMATION_DELAY);
        display_map(this.map);
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
        display.remove_children(UIIDS.display_deck);
        display.display_message(UIIDS.shop_message, ``);
        var shop = new Shop(this.deck);
        display_entire_deck(this.deck);
        refresh_shop_display(shop);
        GAME_SCREEN_DIVISIONS.swap(UIIDS.shop);
    }
    /**
     * Called when the player dies. Gives the option to restart.
     * @param {string} cause Cause of death.
     */
    game_over(cause){
        // Tells the user the game is over, prevents them fro m continuing, tells them the cause
        // and gives them the chance to retry.
        display_map(this.map);
        display.remove_children(UIIDS.hand_display);
        display.remove_children(UIIDS.move_buttons);
        say_record(`${game_over_message}${cause.toLowerCase()}.`);
        display.remove_children(UIIDS.move_buttons);
        var restart = function(game){
            return function(message, position){
                display.remove_children(UIIDS.retry_button);
                player_hand_greyed(false);
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
        display_map(this.map);
        await delay(ANIMATION_DELAY);
        display_map(this.map);
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
            player_hand_greyed(true);
            return true;
        }
        return false;
    }
    /** 
     * Returns the lock so the player can take their turn.
     */
    unlock_player_turn(){
        this.#player_turn_lock = true;
        player_hand_greyed(false);
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
    record_message(str, type){
        this.#text_log.push({
            str, 
            type
        });
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
        refresh_hand_display(this.deck);
        refresh_discard_display(this.deck);
        refresh_deck_order_display(this.deck);
        if(this.boons !== undefined){
            var repetition_count = this.boons.has(boon_names.repetition);
            var repeat = repetition_count > 0 && this.map.get_turn_count() % 3 < repetition_count;
            telegraph_repetition_boon(repeat);
        }
    }
    /**
     * Displays the boons to their proper location.
     */
    refresh_boon_display(){
        display_boons(this.boons);
    }
    achieve(name){
        var gained = this.data.achieve(name);
        if(gained){
            say_record(`${achievement_text.unlocked} ${name}`, record_types.achievement);
            SIDEBAR_DIVISIONS.swap(UIIDS.text_log);
            return true;
        }
        say_record(`${achievement_text.repeated} ${name}`, record_types.repeated_achievement);
        return false;
    }
}


