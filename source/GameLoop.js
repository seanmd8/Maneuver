// ----------------GameLoop.js----------------
// File contains functions that control the main gameplay.

/** @returns {void} */
function setup(){
    // Function ran on page load or on restart to set up the game.
    var start = STARTING_AREA();
    display.display_message(ui_id.title, game_title);
    display.display_message(ui_id.display_message, `${start.description}\n${welcome_message}`);
    mapData = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT, start); 
    mapData.add_tile(STARTING_ENEMY());
    mapData.display();
    mapData.display_stats(ui_id.stats);
    deck = STARTING_DECK();
    deck.display_hand(ui_id.hand_display);
    display.display_message(ui_id.shop_instructions, mod_deck);
    display.swap_screen(ui_id.game_screen);
    display.swap_screen(ui_id.stage);
}
/** 
 * @param {PlayerCommand[]} behavior
 * @param {number} hand_pos 
 */
async function player_turn(behavior, hand_pos){
    // Function to execute the outcome of the player's turn.
    display.display_message(ui_id.display_message, ``);
    try{
        for(var i = 0; i < behavior.length; ++i){
            // Does each valid command in the behavior list.
            player_action(mapData, behavior[i]);
        }
        // Discards the card the user used.
        display.clear_tb(ui_id.move_buttons);
        deck.discard(hand_pos);
        mapData.display();
        await delay(ANIMATION_DELAY);
        // Does the enemies' turn.
        await mapData.enemy_turn();
        // Prep for player's next turn.
        prep_turn();
    }
    catch (error){
        var m = error.message;
        if(m === `floor complete`){
            // If the player has reached the end of the floor.
            mapData.display_stats(ui_id.stats);
            enter_shop();
        }
        else if(m === `game over`){
            // If the player's health reached 0
            game_over(error.cause.message);
        }
        else if(m === `pass to player`){
            // If the enemies' turn was interrupted,
            // prep for player's next turn.
            prep_turn();
        }
        else{
            throw error;
        }
    }
}
/**
 * @param {GameMap} mapData 
 * @param {PlayerCommand} action 
 */
function player_action(mapData, action){
    if(action.type === `attack`){
        mapData.player_attack(action.change);
    }
    else if(action.type === `move`){
        mapData.player_move(action.change);
    }
    else{
        throw new Error(`invalid action type`);
    }
}
/** @returns {void} */
function new_floor(){
    // Creates the next floor.
    mapData.next_floor();
    mapData.display_stats(ui_id.stats);
    mapData.display();
    deck.deal();
    deck.display_hand(ui_id.hand_display);
    display.swap_screen(ui_id.stage);
}
/** @returns {void} */
function enter_shop(){
    // Gives the player the option to add or remove a card from their deck.
    // Their deck contents are also displayed.
    // Options to remove cards will not be displayed if the deck is at the minimum size already.
    display.clear_tb(ui_id.move_buttons);
    display.clear_tb(ui_id.add_card);
    display.clear_tb(ui_id.remove_card);
    display.clear_tb(ui_id.display_deck);
    deck.display_all(ui_id.display_deck);
    generate_add_row(deck, ui_id.add_card);
    generate_remove_row(deck, ui_id.remove_card);
    display.swap_screen(ui_id.shop);
}
/** @returns {void} */
function generate_add_row(deck, table){
    var add_list_generators = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
    var add_list = [];
    for(var i = 0; i < add_list_generators.length; ++i){
        add_list[i] = add_list_generators[i]();
    }
    add_list.unshift({pic: `${img_folder.other}plus.png`})
    var make_add_card = function(deck){
        return function(card, position){
            if(position > 0){
                deck.add(card);
                new_floor();
            }
        }
    }
    display.add_tb_row(table, add_list, CARD_SCALE, make_add_card(deck));
}
/** @returns {void} */
function generate_remove_row(deck, table){
    var remove_list = deck.get_rand_cards(REMOVE_CHOICE_COUNT);
    if(remove_list){
        remove_list.unshift({pic: `${img_folder.other}minus.png`});
    }
    else{
        remove_list.unshift({pic: `${img_folder.other}x.png`});
    }
    var make_remove_card = function(deck){
        return function(card, position){
            if(position > 0){
                deck.remove(card.id);
                new_floor();
            }
        }
    }
    display.add_tb_row(table, remove_list, CARD_SCALE, make_remove_card(deck));
}
/**
 * @param {number} ms 
 * @returns {Promise<*>}
 */
function delay(ms){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, ms);
    })
}
/**
 * @param {string} cause 
 */
function game_over(cause){
    // Tells the user the game is over, prevents them fro m continuing, tells them the cause
    // and gives them the chance to retry.
    mapData.display();
    display.clear_tb(ui_id.hand_display);
    display.clear_tb(ui_id.move_buttons);
    display.display_message(ui_id.display_message, `${game_over_message}${cause}.`);
    display.clear_tb(ui_id.move_buttons);
    var restart = function(){
        display.clear_tb(ui_id.move_buttons);
        setup();
    };
    var restart_message = [{
        description: retry_message
    }]
    display.add_button_row(ui_id.move_buttons, restart_message, restart);
}
/**
 * @template T
 * @param {T} element 
 * @param {T[]} arr 
 * @returns {number}
 */
function search(element, arr){
    for(var i = 0; i < arr.length; ++i){
        if(element === arr[i]){
            return i;
        }
    }
    return -1;
}
/**
 * @param {Card} card 
 */
function give_temp_card(card){
    deck.add_temp(card);
}
/** @returns {void} */
function prep_turn(){
    mapData.resolve_events();
    mapData.display();
    deck.display_hand(ui_id.hand_display);
    mapData.display_stats(ui_id.stats);
}
/**
 * @template T
 * @param {T[]} source 
 * @param {number} draws 
 * @returns {T[]}
 */
function rand_no_repeates(source, draws){
    var index_arr = [];
    var result = [];
    draws = Math.min(draws, source.length);
    for(var i = 0; i < source.length; ++i){
        index_arr.push(i);
    }
    for(var i = 0; i < draws; ++i){
        var rand = random_num(index_arr.length);
        result.push(source[index_arr[rand]]);
        index_arr[rand] = index_arr[index_arr.length - 1];
        index_arr.pop();
    }
    return result;
}
/**
 * @param {Tile} tile 
 * @returns {string}
 */
function tile_description(tile){
    if(tile.description === undefined){
        throw new Error(`tile missing description`);
    }
    var hp = ``
    var stunned = ``;
    if(tile.max_health !== undefined && tile.health !== undefined){
        hp = `(${tile.health}/${tile.max_health} hp) `;
    }
    else if(tile.health !== undefined){
        hp = `(${tile.health} hp) `;
    }
    if(tile.stun !== undefined && tile.stun > 0){
        stunned = `*${stunned_msg}${tile.stun}* `;
    }
    return `${hp}${stunned}${tile.description}`;
}
/**
 * @param {Tile} player 
 * @param {number} scale 
 */
function display_health(player, scale){
    if(player.health === undefined || player.max_health === undefined){
        throw new Error(`player missing health`);
    }
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({pic: `${img_folder.other}heart.png`});
    }
    for(var i = 0; i < (player.max_health - player.health); ++i){
        health.push({pic: `${img_folder.other}heart_broken.png`});
    }
    display.add_tb_row(ui_id.health_display, health, scale);
}
/**
 * @param {string} message 
 * @param {number} wrap_length 
 * @param {string} [delimiter = undefined]
 * @returns {string}
 */
function wrap_str(message, wrap_length, delimiter = undefined){
    var new_message = ``;
    var str_arr = [];
    if(message.indexOf(`\n`) > -1){
        str_arr = message.split(`\n`);
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${wrap_str(str_arr[i], wrap_length, delimiter)}\n`
        }
    }
    else if(delimiter === undefined){
        var start = 0;
        while(start < message.length){
            var end = Math.min(message.length, start + wrap_length);
            str_arr.push(message.slice(start, end));
            start = end;
        }
        for(var i = 0; i < str_arr.length; ++i){
            new_message = `${new_message}${str_arr[i]}\n`
        }
    }
    else{
        str_arr = message.split(` `);
        var line = ``
        for(var i = 0; i < str_arr.length; ++i){
            line = `${line}${str_arr[i]} `;
            if(line.length >= wrap_length){
                new_message = `${new_message}${line.slice(0, -1)}\n`
                line = ``;
            } 
        }
        if(line.length >= 0){
            new_message = `${new_message}${line.slice(0, -1)}\n`
        } 
    }
    return new_message.slice(0, -1);
}