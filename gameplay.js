const ANIMATION_DELAY = 300;

function setup(){
    mapData = new GameMap(8, 8);  
    mapData.add_enemy(spider_tile());
    mapData.display();
    deck = make_starting_deck();
    deck.display_hand(document.getElementById("handDisplay"));
}
function describe(description){
    document.getElementById("displayMessage").innerText = description;
}
function clear_tb(element_id){
    while(document.getElementById(element_id).rows.length > 0){
        document.getElementById(element_id).deleteRow(0);
    }
}
function prep_move(move, hand_pos){
    clear_tb("moveButtons");
    var row = document.createElement("tr");
    row.id = "buttons";
    for(var i = 0; i < move.descriptions.length; ++i){
        var cell = document.createElement("input");
        cell.type = "button"
        cell.name = move.descriptions[i];
        cell.value = move.descriptions[i];
        var act = function(behavior, hand_pos){return function(){action(behavior, hand_pos)}};
        cell.onclick = act(move.behavior[i], hand_pos);
        row.append(cell);
    }
    document.getElementById("moveButtons").append(row);
}
async function action(behavior, hand_pos){
    try{
        for(var i = 0; i < behavior.length; ++i){
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
        deck.discard(hand_pos);
        clear_tb("moveButtons");
        deck.display_hand(document.getElementById("handDisplay"));
        mapData.display();
        await delay(ANIMATION_DELAY);
        await mapData.enemy_turn();
        mapData.display();
    }
    catch (error){
        var m = error.message;
        if(m === "floor complete"){
            modify_deck();
        }
        else if(m === "game over"){
            mapData.display();
            clear_tb("handDisplay");
            describe("Game Over. You were killed by a " + error.cause + ".");
        }
        else{
            console.log(m)
        }
    }
}
function new_floor(){
    clear_tb("modifyDeck");
    document.getElementById("currentDeck").innerText = "";
    clear_tb("displayDeck");
    var floor = mapData.erase(mapData.player_health());
    for(var i = floor * 2; i > 0;){
        var choice = Math.floor(Math.random() * enemy_list.length);
        var new_enemy = enemy_list[choice]();
        if(new_enemy.difficulty <= i){
            mapData.add_enemy(new_enemy);
            i -= new_enemy.difficulty;
        }
    }
    describe("");
    document.getElementById("floorNumber").innerText = "Floor " + floor;
    deck.deal();
    mapData.display();
    deck.display_hand(document.getElementById("handDisplay"));
}
function modify_deck(){
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
    catch{}
    clear_tb("mapDisplay");
    clear_tb("handDisplay");
    clear_tb("moveButtons");
    describe("Choose one card to add or remove");
    
    var add = function(card){return function(){
        deck.add(card);
        new_floor();
    }};
    var add_row = document.createElement("tr");
    add_row.id = "add_row";
    var plus = make_cell("plus", "images/other/plus.png", HAND_SCALE);
    add_row.append(plus);

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

    for(var i = 0; i < add_list.length; ++i){
        var cell = make_cell("card " + i, "images/cards/" + add_list[i].pic, HAND_SCALE, add, add_list[i]);
        add_row.append(cell);
    }
    
    
    for(var i = 0; i < remove_list.length; ++i){
        var cell = make_cell("card " + i, "images/cards/" + remove_list[i].pic, HAND_SCALE, remove, remove_list[i]);
        remove_row.append(cell);
    }

    table.append(add_row);
    table.append(remove_row);
}
function make_cell(id, pic, size, click = undefined, param1 = undefined, param2 = undefined){
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
    return new Promise(resolve =>{
        setTimeout(resolve, ms);
    })
}