// ----------------GameLoop.js----------------
// File contains functions that control the main gameplay.

const ANIMATION_DELAY = 300; // Controls the length of time the map is displayed before moving onto the next entitie's turn in ms.
const STARTING_ENEMY = spider_tile; // Controls the single enemy on the first floor.
const STARTING_DECK = make_starting_deck;


function setup(){
    // Function ran on page load or on restart to set up the game.
    describe(welcome_message);
    mapData = new GameMap(8, 8);  
    mapData.add_tile(STARTING_ENEMY());
    mapData.display();
    mapData.display_stats(document.getElementById("stats"));
    deck = STARTING_DECK();
    deck.display_hand(document.getElementById("handDisplay"));
}
function describe(description){
    // Used to display text to the "displayMessage" element
    document.getElementById("displayMessage").innerText = description;
}
function clear_tb(element_id){
    // Deletes all rows from the given html table.
    while(document.getElementById(element_id).rows.length > 0){
        document.getElementById(element_id).deleteRow(0);
    }
}
async function action(behavior, hand_pos){
    // Function to execute the outcome of the player's turn.
    try{
        for(var i = 0; i < behavior.length; ++i){
            // Does each valid command in the behavior list.
            if(behavior[i][0] === "attack"){
                mapData.player_attack(behavior[i][1], behavior[i][2]);
            }
            else if(behavior[i][0] === "move"){
                mapData.player_move(behavior[i][1], behavior[i][2]);
            }
            else{
                throw new Error("invalid action type");
            }
        }
        describe("");
        // Discards the card the user used.
        clear_tb("moveButtons");
        deck.discard(hand_pos);
        deck.display_hand(document.getElementById("handDisplay"));
        mapData.display();
        await delay(ANIMATION_DELAY);
        // Does the enemies' turn.
        await mapData.enemy_turn();
        mapData.display();
        // Update turn number.
        mapData.display_stats(document.getElementById("stats"))
    }
    catch (error){
        var m = error.message;
        if(m === "floor complete"){
            // If the player has reached the end of the floor.
            mapData.display_stats(document.getElementById("stats"))
            modify_deck();
        }
        else if(m === "game over"){
            // If the player's health reached 0
            game_over(error.cause);
        }
        else if(m === "pass to player"){
            // If the enemies' turn was interrupted.
            mapData.display();
            mapData.display_stats(document.getElementById("stats"))
        }
        else{
            throw error;
        }
    }
}
function new_floor(){
    // Creates the next floor.
    clear_tb("modifyDeck");
    document.getElementById("currentDeck").innerText = "";
    clear_tb("displayDeck");
    var floor = mapData.erase(mapData.player_health());
    floor_generator(floor, mapData);
    mapData.display_stats(document.getElementById("stats"));
    deck.deal();
    mapData.display();
    deck.display_hand(document.getElementById("handDisplay"));
}
function modify_deck(){
    // Gives the player the option to add or remove a card from their deck.
    // Their deck contents are also displayed.
    // Options to remove cards will not be displayed if the deck is at the minimum size already.
    var add_list = [];
    var remove_list = [];
    var table = document.getElementById("modifyDeck");
    deck.display_all(document.getElementById("displayDeck"));
    for(var i = 0; i < ADD_CHOICES; ++i){
        add_list.push(CARD_CHOICES[Math.floor(Math.random() * CARD_CHOICES.length)]());
    }
    try{
        for(var i = 0; i < REMOVE_CHOICES; ++i){
            remove_list.push(deck.get_rand());
        }
    }
    catch{
        // deck.get_rand throws an error if the deck is at the minimum size, in which case they should not
        // be able to remove more cards.
    }
    clear_tb("mapDisplay");
    clear_tb("handDisplay");
    clear_tb("moveButtons");
    describe("Choose one card to add or remove");

    // Options to add.
    var add = function(card){return function(){
        deck.add(card);
        new_floor();
    }};
    var add_row = document.createElement("tr");
    add_row.id = "add_row";
    var plus = make_cell("plus", "images/other/plus.png", HAND_SCALE);
    add_row.append(plus);
    for(var i = 0; i < add_list.length; ++i){
        var cell = make_cell("card " + i, "images/cards/" + add_list[i].pic, HAND_SCALE, add, add_list[i]);
        add_row.append(cell);
    }

    // Options to Remove.
    var remove = function(card){return function(){
        deck.remove(card.id);
        new_floor();
    }};
    var remove_row = document.createElement("tr");
    remove_row.id = "remove_row";
    var minus = make_cell("plus", "images/other/minus.png", HAND_SCALE);
    if(remove_row.length === 0){
        minus = make_cell("x", "images/other/x.png", HAND_SCALE);
    }
    remove_row.append(minus);
    for(var i = 0; i < remove_list.length; ++i){
        var cell = make_cell("card " + i, "images/cards/" + remove_list[i].pic, HAND_SCALE, remove, remove_list[i]);
        remove_row.append(cell);
    }

    table.append(add_row);
    table.append(remove_row);
}
function make_cell(id, pic, size, click = undefined, param1 = undefined, param2 = undefined){
    // Function to make a cell for a table.
    //  id is the id the cell should get.
    //  pic is the image source the cell should have.
    //  size is the width and height of the image.
    //  click is the onclick function.
    //  param1 and param2 are the parameter that should be given to the onclick if they are provided.
    // Returns the cell
    var cell = document.createElement("td");
    cell.id = id;
    var image = document.createElement("img");
    image.src = pic;
    image.height = size;
    image.width = size;
    if(click != undefined){
        if(param2 === undefined){
            image.onclick = click(param1);
        }
        else{
            image.onclick = click(param1, param2);
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
    clear_tb("handDisplay");
    clear_tb("moveButtons");
    describe("Game Over. You were killed by a " + cause + ".");
    clear_tb("moveButtons");
    var row = document.createElement("tr");
    row.id = "buttons";
    var cell = document.createElement("input");
    cell.type = "button"
    cell.name = "retry";
    cell.value = "retry";
    var restart = function(){
        clear_tb("moveButtons");
        setup();
    };
    cell.onclick = restart;
    row.append(cell);
    document.getElementById("moveButtons").append(row);
}