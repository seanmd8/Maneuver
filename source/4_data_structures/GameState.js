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

        var starting_text = `${gameplay_text.new_area}${start.name}.\n${gameplay_text.welcome}`;
        this.data.add_area(start.name);
        say_record(starting_text);
        display.display_message(UIIDS.hand_label, `${gameplay_labels.hand}`);
        display.display_message(UIIDS.move_label, `${gameplay_labels.move}`);
        create_sidebar();
        
        // Starting achievements
        for(var a of init.achievements){
            this.achieve(a);
        }
        // Auto identify these boons
        for(var b of init.identify_boons){
            this.data.boons.add(b().name);
        }
        this.data.save();

        // Prep map
        for(var i = 0; i < init.enemies.length; ++i){
            var enemy = init.enemies[i]();
            if(init.spawnpoints === undefined || init.spawnpoints.length <= i){
                this.map.spawn_safely(enemy, SAFE_SPAWN_ATTEMPTS, true);
            }
            else{
                this.map.add_tile(enemy, init.spawnpoints[i]);
            }
        }
        for(var boon of init.chests){
            var chest = chest_tile();
            add_boon_to_chest(chest, boon());
            this.map.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        refresh_map(this.map);
        this.map.display_stats();

        this.refresh_deck_display();
        display.display_message(UIIDS.shop_instructions, shop_text.header);
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
        say(``);
        if(GS.boons.has(boon_names.thick_soles)){
            GS.map.get_player().tags.add(TAGS.invulnerable);
        }
        try{
            // The repetition boon will double movements 1 in every 3 turns.
            var repeat = repeat_amount();
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
            refresh_map(this.map);
            await delay(ANIMATION_DELAY);
            if(is_instant){
                this.refresh_deck_display();
                this.unlock_player_turn();
                this.map.display_stats();
                refresh_map(this.map);
                this.unlock_player_turn();
                return;
            }
            await this.map.enemy_turn();
            await this.prep_turn();
        }
        catch (error){
            this.handle_errors(error);
        }
    }
    handle_errors(e){
        var m = e.message
        switch(m){
            case ERRORS.floor_complete:
                this.map.display_stats();
                this.enter_shop();
                break;
            case ERRORS.game_over:
                this.game_over(e.cause.message);
                break;
            case ERRORS.pass_turn:
                try{
                    this.prep_turn();
                }
                catch(error){
                    this.handle_errors(error);
                }
                break;
            case ERRORS.victory:
                this.victory();
                break;
            default:
                throw e;
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
                    this.boons.has(boon_names.pacifism) > 0 && 
                    !action.change.is_origin() &&
                    this.map.is_in_bounds(target) &&
                    !this.map.get_tile(target).tags.has(TAGS.obstruction)
                ){
                    stun_count += 2 * attack_count;
                    attack_count = 0;
                }
                for(var i = 0; i < attack_count; ++i){
                    var target = this.map.get_player_location().plus(action.change);
                    if(
                        i === 0 ||
                        (this.map.is_in_bounds(target) && 
                        this.map.get_tile(target).type !== entity_types.chest)
                    ){
                        // Do delayed_strike
                        this.map.player_attack(action.change);
                    }
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
     */
    async new_floor(){
        // Creates the next floor.
        this.map.next_floor();
        this.map.display_stats();
        refresh_map(this.map);
        this.deck.deal();
            if(GS.boons.has(boon_names.vicious_cycle) > 0){
            apply_vicious_cycle(this.deck);
        }
        this.refresh_deck_display();
        GAME_SCREEN_DIVISIONS.swap(UIIDS.stage);
        await delay(ANIMATION_DELAY);
        refresh_map(this.map);
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
        // Tells the user the game is over, prevents them from continuing, tells them the cause
        // and gives them the chance to retry.
        refresh_map(this.map);
        display.remove_children(UIIDS.hand_display);
        display.remove_children(UIIDS.move_buttons);
        say_record(`${gameplay_text.game_over}${cause.toLowerCase()}.`);
        var restart = function(game){
            return function(message, position){
                display.remove_children(UIIDS.retry_button);
                player_hand_greyed(false);
                display.remove_class(UIIDS.chest,`large-chest`);
                game.setup();
            };
        }
        var restart_message = [{
            description: gameplay_labels.retry,
            on_click: restart(this),
        }];
        display.add_button_row(UIIDS.retry_button, restart_message);
        refresh_full_deck_display(this.deck);
        var swap_visibility = function(id_list, id){
            return function(){
                id_list.swap(id);
            }
        }
        display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.full_deck, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.full_deck));
    }
    victory(){
        refresh_map(this.map);
        display_victory();
        this.achieve(achievement_names.victory);
        say_record(gameplay_text.victory);
        refresh_full_deck_display(this.deck);
        var swap_visibility = function(id_list, id){
            return function(){
                id_list.swap(id);
            }
        }
        display.create_visibility_toggle(UIIDS.sidebar_header, SIDEBAR_BUTTONS.full_deck, swap_visibility(SIDEBAR_DIVISIONS, UIIDS.full_deck));
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
        refresh_map(this.map);
        await delay(ANIMATION_DELAY);
        refresh_map(this.map);
        this.refresh_deck_display();
        this.map.display_stats();
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
            telegraph_repetition_boon(repeat_amount());
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