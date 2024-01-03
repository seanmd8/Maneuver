// ----------------GameLoop.js----------------
// File contains functions that control the main gameplay.


function setup(){
    // Function ran on page load or on restart to set up the game.
    display.display_message(ui_id.title, game_title)
    display.display_message(ui_id.display_message, welcome_message);
    mapData = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT);  
    mapData.add_tile(STARTING_ENEMY());
    mapData.display();
    mapData.display_stats(ui_id.stats);
    deck = STARTING_DECK();
    deck.display_hand(ui_id.hand_display);
    display.display_message(ui_id.shop_instructions, mod_deck);
    display.swap_screen(ui_id.game_screen);
    display.swap_screen(ui_id.stage);
}
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
            game_over(error.cause);
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
function player_action(mapData, action){
    if(action[0] === `attack`){
        mapData.player_attack(action[1], action[2]);
    }
    else if(action[0] === `move`){
        mapData.player_move(action[1], action[2]);
    }
    else{
        throw new Error(`invalid action type`);
    }
}
function new_floor(){
    // Creates the next floor.
    var floor = mapData.erase();
    floor_generator(floor, mapData);
    mapData.display_stats(ui_id.stats);
    mapData.display();
    deck.deal();
    deck.display_hand(ui_id.hand_display);
    display.swap_screen(ui_id.stage);
}
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
function generate_add_row(deck, table){
    var add_list = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
    for(var i = 0; i < add_list.length; ++i){
        add_list[i] = add_list[i]();
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
function generate_remove_row(deck, table){
    var remove_list = deck.get_rand_arr(REMOVE_CHOICE_COUNT);
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
function make_cell(id, pic, size, click = undefined, param1 = undefined, param2 = undefined){
    // Function to make a cell for a table.
    //  id is the id the cell should get.
    //  pic is the image source the cell should have.
    //  size is the width and height of the image.
    //  click is the onclick function.
    //  param1 and param2 are the parameter that should be given to the onclick if they are provided.
    // Returns the cell
    var cell = document.createElement(`td`);
    cell.id = id;
    var image = document.createElement(`img`);
    image.id = `${id} img`;
    image.src = pic;
    image.height = size;
    image.width = size;
    if(click != undefined){
        if(param2 === undefined){
            cell.onclick = click(param1);
        }
        else{
            cell.onclick = click(param1, param2);
        }
    }
    cell.append(image);
    return cell;
}
function delay(ms){
    // Function to wait the given number of milliseconds.
    return new Promise(resolve =>{
        setTimeout(resolve, ms);
    })
}
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
function search(element, arr){
    for(var i = 0; i < arr.length; ++i){
        if(element === arr[i]){
            return i;
        }
    }
    return -1;
}
function give_temp_card(card){
    deck.add_temp(card);
}
function prep_turn(){
    mapData.resolve_events();
    mapData.display();
    deck.display_hand(ui_id.hand_display);
    mapData.display_stats(ui_id.stats);
}
function rand_no_repeates(source, draws){
    var index_arr = [];
    var result = [];
    draws = Math.min(draws, source.length);
    for(var i = 0; i < source.length; ++i){
        index_arr.push(i);
    }
    for(var i = 0; i < draws; ++i){
        rand = random_num(index_arr.length);
        result.push(source[index_arr[rand]]);
        index_arr[rand] = index_arr[index_arr.length - 1];
        index_arr.pop();
    }
    return result;
}
function tile_description(tile){
    var hp = ``
    if(tile.hasOwnProperty(`max_health`)){
        var hp = `(${tile.health}/${tile.max_health} hp) `;
    }
    else if(tile.hasOwnProperty(`health`)){
        var hp = `(${tile.health} hp) `;
    }
    return `${hp}${tile.description}`;
}
function display_health(player, scale){
    var health = [];
    for(var i = 0; i < player.health; ++i){
        health.push({pic: `${img_folder.other}heart.png`});
    }
    for(var i = 0; i < (player.max_health - player.health); ++i){
        health.push({pic: `${img_folder.other}heart_broken.png`});
    }
    display.add_tb_row(ui_id.health_display, health, scale);
}
