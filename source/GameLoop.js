// ----------------GameLoop.js----------------
// File contains functions that control the main gameplay.

document.onkeydown = press;

function setup(){
    // Function ran on page load or on restart to set up the game.
    describe(game_title, `title`)
    describe(welcome_message);
    mapData = new GameMap(FLOOR_WIDTH, FLOOR_HEIGHT);  
    mapData.add_tile(STARTING_ENEMY());
    mapData.display();
    mapData.display_stats(document.getElementById(`stats`));
    deck = STARTING_DECK();
    deck.display_hand(document.getElementById(`handDisplay`));
    describe(mod_deck, `shopInstruction`);
    swap_screen(`gameScreen`);
    swap_screen(`stage`);
}
function describe(description, element = `displayMessage`){
    // Used to display text to the `displayMessage` element
    document.getElementById(element).innerText = description;
}
function clear_tb(element_id){
    // Deletes all rows from the given html table.
    while(document.getElementById(element_id).rows.length > 0){
        document.getElementById(element_id).deleteRow(0);
    }
}
async function player_turn(behavior, hand_pos){
    // Function to execute the outcome of the player's turn.
    describe(``);
    try{
        for(var i = 0; i < behavior.length; ++i){
            // Does each valid command in the behavior list.
            player_action(mapData, behavior[i]);
        }
        // Discards the card the user used.
        clear_tb(`moveButtons`);
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
            mapData.display_stats(document.getElementById(`stats`))
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
    mapData.display_stats(document.getElementById(`stats`));
    mapData.display();
    deck.deal();
    deck.display_hand(document.getElementById(`handDisplay`));
    swap_screen(`stage`);
}
function enter_shop(){
    // Gives the player the option to add or remove a card from their deck.
    // Their deck contents are also displayed.
    // Options to remove cards will not be displayed if the deck is at the minimum size already.
    clear_tb(`modifyDeck`);
    clear_tb(`displayDeck`);
    deck.display_all(document.getElementById(`displayDeck`));
    var table = document.getElementById(`modifyDeck`);
    table.append(generate_add_row());
    table.append(generate_remove_row());
    swap_screen(`shop`);
}
function generate_add_row(){
    var add_list = rand_no_repeates(CARD_CHOICES, ADD_CHOICE_COUNT);
    var add = function(card){return function(){
        deck.add(card);
        new_floor();
    }};
    var add_row = document.createElement(`tr`);
    add_row.id = `add_row`;
    var plus = make_cell(`plus`, `images/other/plus.png`, CARD_SCALE);
    add_row.append(plus);
    for(var i = 0; i < add_list.length; ++i){
        var card = add_list[i]();
        var cell = make_cell(`card ${i}`, `images/cards/${card.pic}`, CARD_SCALE, add, card);
        add_row.append(cell);
    }
    return add_row;
}
function generate_remove_row(){
    var remove_list = deck.get_rand_arr(REMOVE_CHOICE_COUNT);
    var remove = function(card){return function(){
        deck.remove(card.id);
        new_floor();
    }};
    var remove_row = document.createElement(`tr`);
    remove_row.id = `remove_row`;
    var minus = make_cell(`plus`, `images/other/minus.png`, CARD_SCALE);
    if(remove_row.length === 0){
        minus = make_cell(`x`, `images/other/x.png`, CARD_SCALE);
    }
    remove_row.append(minus);
    for(var i = 0; i < remove_list.length; ++i){
        var card = remove_list[i];
        var cell = make_cell(`card ${i}`, `images/cards/${card.pic}`, CARD_SCALE, remove, card);
        remove_row.append(cell);
    }
    return remove_row;
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
    clear_tb(`handDisplay`);
    clear_tb(`moveButtons`);
    describe(`${game_over_message}${cause}.`);
    clear_tb(`moveButtons`);
    var row = document.createElement(`tr`);
    row.id = `buttons`;
    var cell = document.createElement(`input`);
    cell.type = `button`
    cell.name = `retry`;
    cell.value = retry_message;
    var restart = function(){
        clear_tb(`moveButtons`);
        setup();
    };
    cell.onclick = restart;
    row.append(cell);
    document.getElementById(`moveButtons`).append(row);
}
function press(key){
    var controls = [`q`, `w`, `e`, `a`, `s`, `d`, `z`, `x`, `c`];
    var k = search(key.key, controls);
    if(k >= 0){
        var element = document.getElementById(`button ${k}`);
        if(!(element.onclick === null)){
            element.click();
        }
    }
    controls = [`h`, `j`, `k`];
    k = search(key.key, controls);
    if(k >= 0){
        var element = document.getElementById(`hand ${k}`);
        if(!(element.onclick === null)){
            element.click();
        }
    }
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
    deck.display_hand(document.getElementById(`handDisplay`));
    mapData.display_stats(document.getElementById(`stats`))
}
function swap_screen(screen){
    switch(screen){
        case `gameScreen`:
            document.getElementById(`tutorial`).style.display = `none`;
            document.getElementById(`gameScreen`).style.display = `block`;
            break;
        case `stage`:
            document.getElementById(`shop`).style.display = `none`;
            document.getElementById(`chest`).style.display = `none`;
            document.getElementById(`stage`).style.display = `block`;
            break;
        case `shop`:
            document.getElementById(`stage`).style.display = `none`;
            document.getElementById(`chest`).style.display = `none`;
            document.getElementById(`shop`).style.display = `block`;
            break;
        case `chest`:
            document.getElementById(`stage`).style.display = `none`;
            document.getElementById(`shop`).style.display = `none`;
            document.getElementById(`chest`).style.display = `block`;
            break;
        case `tutorial`:
            document.getElementById(`gameScreen`).style.display = `none`;
            document.getElementById(`tutorial`).style.display = `block`;
            break;
        default:
            throw Error(`invalid screen swap`);
    }
    return;
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
