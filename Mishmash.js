const ANIMATION_DELAY = 300;

function setup(){
    mapData = new GameMap(8, 8);  
    mapData.add_enemy(spider_tile());
    mapData.display();
    deck = make_starting_deck();
    deck.display_hand(document.getElementById("handDisplay"));
}
function describe(description){
    document.getElementById("descriptionText").innerText = description;
}
function clear_tb(element_id){
    while(document.getElementById(element_id).rows.length > 0){
        document.getElementById(element_id).deleteRow(0);
    }
}
function prep_move(move, hand_pos){
    clear_tb("moveButtons");
    var row = document.createElement('tr');
    row.id = "buttons";
    for(var i = 0; i < move.descriptions.length; ++i){
        var cell = document.createElement('input');
        cell.type = 'button'
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
        if(m === 'floor complete'){
            modify_deck();
        }
        else if(m === 'game over'){
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
    document.getElementById("header4").innerText = "";
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
    document.getElementById('header2').innerText = 'Floor ' + floor;
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
    var add_row = document.createElement('tr');
    add_row.id = "add_row";
    var plus = make_cell("plus", "images/other/plus.png", HAND_SCALE);
    add_row.append(plus);

    var remove = function(card){return function(){
        deck.remove(card.id);
        new_floor();
    }};
    var remove_row = document.createElement('tr');
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
    var cell = document.createElement('td');
    cell.id = id;
    var image = document.createElement('img');
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

const HAND_SIZE = 3;
const HAND_SCALE = 100;
const ADD_CHOICES = 3;
const REMOVE_CHOICES = 3;
const DECK_MINIMUM = 5;
const DECK_DISPLAY_WIDTH = 5;

class MoveDeck{
    #list;
    #library;
    #hand;
    #discard_pile;
    #id_count;
    constructor(){
        this.#list = [];
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        this.#id_count = 0;
    }
    #shuffle(arr){
        var new_arr = [];
        while(arr.length != 0){
            var ran = Math.floor(Math.random() * arr.length);
            new_arr.push(arr[ran]);
            arr[ran] = arr[arr.length - 1];
            arr.pop();
        }
        return new_arr;
    }
    deal(){
        this.#library = [];
        this.#hand = [];
        this.#discard_pile = [];
        for(var i = 0; i < this.#list.length; ++i){
            this.#library.push(this.#list[i]);
        }
        this.#library = this.#shuffle(this.#library);
        for(var i = 0; i < HAND_SIZE; ++i){
            this.#hand.push(this.#library.pop());
        }
    }
    discard(x){
        if(x >= this.#hand.length){
            throw new Error('hand out of bounds');
        }
        if(this.#library.length === 0){
            while(this.#discard_pile.length != 0){
                this.#library.push(this.#discard_pile.pop());
            }
            this.#library = this.#shuffle(this.#library);
        }
        this.#discard_pile.push(this.#hand[x]);
        this.#hand[x] = this.#library.pop();
    }
    add(card){
        card.id = this.#id_count;
        this.#id_count++;
        this.#list.push(card);
    }
    add_temp(card){
        card.id = this.#id_count;
        this.#id_count++;
        this.#library.push(card);
        this.#library = this.#shuffle(this.#library);
    }
    display_hand(table){
        while(table.rows.length > 0){
            table.deleteRow(0);
        }
        var row = document.createElement('tr');
        row.id = "hand";
        var prep = function(move, hand_pos){return function(){prep_move(move, hand_pos)}};
        for(var i = 0; i < this.#hand.length; ++i){
            var cell =  make_cell("card " + i, "images/cards/" + this.#hand[i].pic, HAND_SCALE, prep, this.#hand[i], i);
			row.append(cell);
        }
        table.append(row);
    }
    display_all(table){
        document.getElementById("header4").innerText = "Current Deck:";
        for(var i = 0; i < Math.ceil(this.#list.length / DECK_DISPLAY_WIDTH); ++i){
            var row = document.createElement('tr');
            for(var j = 0; j < DECK_DISPLAY_WIDTH && j + i * DECK_DISPLAY_WIDTH < this.#list.length; ++j){
                var cell =  make_cell("card " + (i * DECK_DISPLAY_WIDTH + j), "images/cards/" + this.#list[i * DECK_DISPLAY_WIDTH + j].pic, HAND_SCALE);
			    row.append(cell);
            }
            table.append(row);
        }
    }
    get_rand(){
        if(this.#list.length <= DECK_MINIMUM){
            throw new Error("deck minimum reached");
        }
        return this.#list[Math.floor(Math.random() * this.#list.length)];
    }
    remove(id){
        for(var i = 0; i < this.#list.length; ++i){
            if(this.#list[i].id === id){
                this.#list[i] = this.#list[this.#list.length - 1];
                this.#list.pop();
                return true;
            }
        }
        return false;
    }
}


const GRID_SCALE = 30;

class GameMap{
    #x_max;
    #y_max;
    #entity_list;
    #grid;
    #floor;
    constructor(x_max, y_max){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#floor = 0;
        this.erase()
    }
    erase(player_health = -1){
        this.#entity_list = new EntityList();
        this.#grid = [];
        for(var i = 0; i < this.#x_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#y_max; ++j){
                this.#grid[i].push(empty_tile());
            }
        }
        this.set_exit(Math.floor(Math.random() * this.#y_max), 0)
        this.set_player(Math.floor(Math.random() * this.#y_max), this.#x_max - 1, player_health)
        return ++this.#floor;
    }
    random_space(){
        x = Math.floor(Math.random() * this.#x_max);
        y = Math.floor(Math.random() * this.#y_max);
        return {x, y};
    }
    random_empty(){
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count;
        var rand = Math.floor(Math.random() * num_empty);
        if(num_empty === 0){
            throw new Error('map full');
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                if(this.#grid[x][y].type === 'empty'){
                    if(rand === 0){
                        return {x, y};
                    }
                    --rand;
                }
            }
        }
    }
    check_bounds(x, y){
        if(x < 0 || x >= this.#x_max){
            throw new Error('x out of bounds');
        }
        if(y < 0 || y >= this.#y_max){
            throw new Error('y out of bounds');
        }
    }
    check_empty(x, y){
        if(!(this.#grid[x][y].type === "empty")){
            throw new Error('space not empty');
        }
    }
    set_exit(exit_x, exit_y){
        this.check_bounds(exit_x, exit_y);
        this.check_empty(exit_x, exit_y);
        this.#grid[exit_x][exit_y] = exit_tile();
        ++this.#entity_list.count;
    }
    set_player(player_x, player_y, player_health = -1){
        this.check_bounds(player_x, player_y);
        this.check_empty(player_x, player_y);
        this.#entity_list.set_player(player_x, player_y);
        var player = player_tile();
        if(player_health > 0){
            player.health = player_health;
        }
        this.#grid[player_x][player_y] = player;
        ++this.#entity_list.count;
    }
    add_enemy(enemy, x = -1, y = -1){
        try{
            if(x === -1 || y === -1){
                var position = this.random_empty();
                x = position.x;
                y = position.y;
            }
            this.check_bounds(x, y);
            this.check_empty(x, y);
        }
        catch{
            return false;
        }
        enemy.id = this.#entity_list.next_id();
        this.#grid[x][y] = enemy;
        this.#entity_list.add_enemy(x, y, enemy)
        ++this.#entity_list.count;
        return true;
    }
    display(){
		var visual_map = document.getElementById('mapDisplay');
        
        while(visual_map.rows.length > 0){
            visual_map.deleteRow(0);
        }
		for (var y = 0; y < this.#y_max; y++){
			var row = document.createElement('tr');
            row.id = 'row ' + y;
            var desc = function(str){return function(){
                describe(str);
            }};
			for (var x = 0; x < this.#x_max; x++){
                var tile_description = this.#grid[x][y].description;
                if(this.#grid[x][y].type === "player" || this.#grid[x][y].type === "enemy"){
                    tile_description = "(" + this.#grid[x][y].health + " hp) " + tile_description;
                }
                var cell = make_cell(x + ' ' + y, "images/tiles/" + this.#grid[x][y].pic, GRID_SCALE, desc, tile_description);
                if(this.#grid[x][y].type === "empty"){
                    this.#grid[x][y].pic = "empty.png";
                }
				row.append(cell);
			}
			visual_map.append(row);
		}
        var row = document.createElement('tr');
        row.id = "health";
        for(var i = 0; i < this.player_health(); ++i){
            var cell = make_cell("health " + i, "images/other/heart.png", GRID_SCALE);
			row.append(cell);
        }
        visual_map.append(row);
	}
    move(x1, y1, x2, y2){
        this.check_bounds(x1, y1);
        try{
            this.check_bounds(x2, y2);
        }
        catch{
            return false;
        }
        var start = this.#grid[x1][y1];
        var end = this.#grid[x2][y2];
        if(start.type === "player" && end.type === "exit"){
            throw new Error("floor complete");
        }
        if(!(end.type === "empty")){
            return false;
        }
        this.#entity_list.move_any(x2, y2, start);
        this.#grid[x2][y2] = start;
        this.#grid[x1][y1] = empty_tile();
        return true;
    }
    player_move(x_dif, y_dif){
        var pos = this.#entity_list.get_player_pos();
        return this.move(pos.x, pos.y, pos.x + x_dif, pos.y + y_dif)
    }
    player_health(){
        var pos = this.#entity_list.get_player_pos();
        return this.#grid[pos.x][pos.y].health;
    }
    attack(x, y, hits = "all"){
        try{
            this.check_bounds(x, y);
        }
        catch(error){
            return false;
        }
        var target = this.#grid[x][y];
        if(target.type === "enemy" && (hits === "enemy" || hits === "all")){
            target.health -= 1;
            if(target.health === 0){
                this.#grid[x][y] = empty_tile()
                this.#grid[x][y].pic = "hit.png";
                this.#entity_list.remove_enemy(target.id)
            }
            return true;
        }
        if(target.type === "player" && (hits === "player" || hits === "all")){
            target.health -= 1;
            if(target.health === 0){
                throw new Error("game over")
            }
            return true;
        }
        if(target.type === "empty"){
            target.pic = "hit.png";
        }
        return false;
    }
    player_attack(x_dif, y_dif){
        var pos = this.#entity_list.get_player_pos();
        this.attack(pos.x + x_dif, pos.y + y_dif, "enemy");
    }
    async enemy_turn(){
        await this.#entity_list.enemy_turn(this);
    }
}

class EntityList{
    count
    #player
    #enemy_list
    #id_count
    constructor(){
        this.count = 0;
        this.#id_count = 0;
        this.#player = 0;
        this.#enemy_list = [];
    }
    next_id(){
        return ++this.#id_count;
    }
    set_player(x, y){
        this.#player = {x, y}
    }
    get_player_pos(){
        if(this.#player === 0){
            throw new Error("player doesn't exist");
        }
        return {x: this.#player.x, y: this.#player.y};
    }
    add_enemy(x, y, enemy){
        this.#enemy_list.push({x, y, enemy})
    }
    move_enemy(x, y, id){
        var index = this.#find_by_id(id);
        this.#enemy_list[index].x = x;
        this.#enemy_list[index].y = y;
    }
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error("id not found");
        }
        this.#enemy_list = this.#enemy_list.slice(0, index).concat(this.#enemy_list.slice(index + 1, this.#enemy_list.length));
    }
    #find_by_id(id){
        for(var i = 0; i < this.#enemy_list.length; ++i){
            if(this.#enemy_list[i].enemy.id === id){
                return i;
            }
        }
        return -1;
    }
    move_any(x, y, entity){
        if(entity.type === "player"){
            this.set_player(x, y);
        }
        else if(entity.type === "enemy"){
            this.move_enemy(x, y, entity.id);
        }
        else{
            throw new Error("moving invalid type");
        }
    }
    async enemy_turn(map){
        // How to avoid multi turns via friendly fire shrinking the list?
        var turn = []
        for(var i = 0; i < this.#enemy_list.length; ++i){
            turn.push(this.#enemy_list[i]);
        }
        for(var i = 0; i < turn.length; ++i){
            var e = turn[i];
            if(!(this.#find_by_id(e.enemy.id) === -1)){
                try{
                    e.enemy.behavior(e.x, e.y, this.#player.x - e.x, this.#player.y - e.y, map, e.enemy);
                    map.display();
                    await delay(ANIMATION_DELAY);
                }
                catch{
                    throw new Error("game over", {cause: e.enemy.enemy_type});
                }
            } 
        }
    }
}


const enemy_list = [spider_tile, turret_h_tile, turret_d_tile, scythe_tile, knight_tile, spider_egg_tile, ram_tile];

function empty_tile(){
    return {
        type: "empty",
        pic: "empty.png",
        description: empty_description
    }
}
function exit_tile(){
    return {
        type: "exit",
        pic: "stairs.png",
        description: exit_description
    }
}
function player_tile(){
    return {
        type: "player",
        pic: "helmet.png",
        health: 3,
        description: player_description
    }
}
function spider_tile(){
    return {
        type: "enemy",
        enemy_type: "spider",
        pic: "spider.png",
        id: "",
        health: 1,
        difficulty: 1,
        behavior: spider_ai,
        description: spider_description
    }
}
function turret_h_tile(){
    return {
        type: "enemy",
        enemy_type: "turret",
        pic: "turret_h.png",
        id: "",
        health: 1,
        difficulty: 2,
        behavior: turret_h_ai,
        description: turret_h_description
    }
}
function turret_d_tile(){
    return {
        type: "enemy",
        enemy_type: "turret",
        pic: "turret_d.png",
        id: "",
        health: 1,
        difficulty: 2,
        behavior: turret_d_ai,
        description: turret_d_description
    }
}
function scythe_tile(){
    return{
        type: "enemy",
        enemy_type: "scythe",
        pic: "scythe.png",
        id: "",
        health: 1,
        difficulty: 3,
        behavior: scythe_ai,
        description: scythe_description
    }
}
function knight_tile(){
    return{
        type: "enemy",
        enemy_type: "knight",
        pic: "knight.png",
        id: "",
        health: 2,
        difficulty: 4,
        behavior: knight_ai,
        description: knight_description
    }
}
function spider_egg_tile(){
    spawn_timer = 2
    return{
        type: "enemy",
        enemy_type: "spider egg",
        pic: "spider_egg.png",
        cycle: 0,
        spawn_timer,
        id: "",
        health: 2,
        difficulty: 4,
        behavior: spider_egg_ai,
        description: spider_egg_description[0] + (spawn_timer + 1) + spider_egg_description[1]
    }
}
function ram_tile(){
    return{
        type: "enemy",
        enemy_type: "ram",
        pic: "ram.png",
        cycle: 0,
        id: "",
        health: 2,
        difficulty: 5,
        behavior: ram_ai,
        description: ram_description
    }
}



function velociphile_tile(){
    return{
        type: "enemy",
        enemy_type: "velociphile",
        pic: "velociphile.png",
        id: "",
        health: 3,
        difficulty: "boss",
        behavior: velociphile_ai,
        description: velociphile_description
    }
}

const empty_description = "There is nothing here.";
const exit_description = "Stairs to the next floor.";
const player_description = "You.";
const spider_description = "Spider: Will attack the player if it is next to them. Otherwise it will move closer.";
const turret_h_description = "Turret: Does not move. Fires beams orthogonally that hit the first thing in their path.";
const turret_d_description = "Turret: Does not move. Fires beams diagonally that hit the first thing in their path.";
const scythe_description = "Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them. Can only see diagonally.";
const knight_description = "Knight: Moves in an L shape. If it tramples the player, it will move again.";
const spider_egg_description = ["Spider egg: Does not move. Spawns a spider every ", " turns."];
const ram_description = "Ram: Moves orthogonally. When it sees the player, it will prepare to charge towards them and ram them.";



const velociphile_description = "Velociphile (Boss): A rolling ball of mouths and hate. Moves and attacks in straight lines.";


function spider_ai(x, y, x_dif, y_dif, map, enemy){
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        map.attack(x + x_dif, y + y_dif, "player");
    }
    else{
        x_dif = sign(x_dif);
        y_dif = sign(y_dif);
        map.move(x, y, x + x_dif, y + y_dif);
    }
}
function turret_h_ai(x, y, x_dif, y_dif, map, enemy){
    try{
        if(x_dif === 0){
            var direction = sign(y_dif);
            for(var i = 1; !map.attack(x, y + i * direction); ++i){
                map.check_bounds(x, y + i * direction)
            }
        }
        else if(y_dif === 0){
            var direction = sign(x_dif);
            for(var i = 1; !map.attack(x + i * direction, y); ++i){
                map.check_bounds(x + i * direction, y)
            }
        }
    }
    catch(error){
        if(!(error.message === "x out of bounds" || error.message === "y out of bounds")){
            throw error;
        }
    }
}
function turret_d_ai(x, y, x_dif, y_dif, map, enemy){
    if(!(Math.abs(x_dif) === Math.abs(y_dif))){
        return;
    }
    var x_direction = sign(x_dif);
    var y_direction = sign(y_dif);
    try{
        for(var i = 1; !map.attack(x + i * x_direction, y + i * y_direction); ++i){ 
            map.check_bounds(x + i * x_direction, y + i * y_direction);
        }
    }
    catch(error){
        if(!(error.message === "x out of bounds" || error.message === "y out of bounds")){
            throw error;
        }
    }
}
function scythe_ai(x, y, x_dif, y_dif, map, enemy){
    var direction = Math.floor(Math.random() * 4);
    if(x_dif < 0 && y_dif < 0){
        direction = 0;
    }
    if(x_dif < 0 && y_dif > 0){
        direction = 1;
    }
    if(x_dif > 0 && y_dif < 0){
        direction = 2;
    }
    if(x_dif > 0 && y_dif > 0){
        direction = 3;
    }
    switch(direction){
        case 0:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x - 1, y - 1)){
                    break;
                }
                x -= 1;
                y -= 1;
                map.attack(x + 1, y, "player");
                map.attack(x, y + 1, "player");
            }
            break;
        case 1:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x - 1, y + 1)){
                    break;
                }
                x -= 1;
                y += 1;
                map.attack(x + 1, y, "player");
                map.attack(x, y - 1, "player");
            }
            break;
        case 2:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x + 1, y - 1)){
                    break;
                }
                x += 1;
                y -= 1;
                map.attack(x - 1, y, "player");
                map.attack(x, y + 1, "player");
            }
            break;
        case 3:
            for(var i = 0; i < 3; ++i){
                if(!map.move(x, y, x + 1, y + 1)){
                    break;
                }
                x += 1;
                y += 1;
                map.attack(x - 1, y, "player");
                map.attack(x, y - 1, "player");
            }
            break;
    }
}
function knight_ai(x, y, x_dif, y_dif, map, enemy){
    if(Math.abs(x_dif) === 1 && Math.abs(y_dif) === 1){
        if(!map.move(x, y, x + (2 * sign(x_dif)), y + (-1 * sign(y_dif)))){
            map.move(x, y, x + (-1 * sign(x_dif)), y + (2 * sign(y_dif)));
        }
        return;
    }
    if(Math.abs(x_dif) + Math.abs(y_dif) === 3){
        if(x_dif === 1 || x_dif === -1 || y_dif === 1 || y_dif === -1){
            map.attack(x + x_dif, y + y_dif, "player");
            map.move(x, y, x + x_dif * 2, y + y_dif * 2);
            return;
        }
    }
    if(Math.abs(x_dif) >= Math.abs(y_dif)){
        var new_x = 2;
        var new_y = 1;
    }
    else{
        var new_x = 1;
        var new_y = 2;
    }
    if(x_dif < 0){
        new_x *= -1;
    }
    if(y_dif < 0){
        new_y *= -1;
    }
    map.move(x, y, x + new_x, y + new_y);
}
function spider_egg_ai(x, y, x_dif, y_dif, map, enemy){
    if(enemy.cycle < enemy.spawn_timer){
        ++enemy.cycle;
    }
    else{
        var spawnpoints = random_nearby();
        var i;
        for(i = 0; i < spawnpoints.length && !map.add_enemy(spider_tile(),x + spawnpoints[i][0], y + spawnpoints[i][1]); ++i){}
        enemy.cycle = 0;
    }
}
function ram_ai(x, y, x_dif, y_dif, map, enemy){
    var x_direction = sign(x_dif);
    var y_direction = sign(y_dif);
    var wander_speed = 2;
    if(enemy.cycle === 0){
        var moved = true;
        if(Math.abs(x_dif) <= Math.abs(y_dif)){
            for(var i = 0; i < wander_speed && i < Math.abs(x_dif) && moved; ++i){
                moved = map.move(x, y, x + x_direction, y);
                x += x_direction;
            }
        }
        else{
            for(var i = 0; i < wander_speed && i < Math.abs(y_dif) && moved; ++i){
                moved = map.move(x, y, x, y + y_direction);
                y += y_direction;
            }
        }
        if(moved = true && (Math.abs(x_dif) < 3 || Math.abs(y_dif) < 3)){
            enemy.cycle = 1;
            enemy.pic = "ram_charge.png";
        }
    }
    else{
        var moved = true;
        if(Math.abs(x_dif) > Math.abs(y_dif)){
            while(moved){
                moved = map.move(x, y, x + x_direction, y);
                x += x_direction;
            }
            map.attack(x, y);
        }
        else{
            while(moved){
                moved = map.move(x, y, x, y + y_direction);
                y += y_direction;
            }
            map.attack(x, y);
        }
        enemy.cycle = 0;
        enemy.pic = "ram.png";
    }
}




function velociphile_ai(x, y, x_dif, y_dif, map, enemy){
    
}



function sign(x){
    if(x > 0){
        return 1;
    }
    if(x < 0){
        return -1;
    }
    return 0;
}
function random_nearby(){
    var cords = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    var ran_cords = [];
    while(cords.length > 0){
        var index = Math.floor(Math.random() * cords.length);
        ran_cords.push(cords[index]);
        cords[index] = cords[cords.length - 1];
        cords.pop();
    }
    return ran_cords;
}

const CARD_CHOICES = [short_charge, jump, straight_charge, side_charge, step_left, 
    step_right, trample, horsemanship, lunge_left, lunge_right, 
    sprint, trident, whack, spin_attack, butterfly, 
    retreat, force, side_attack, clear_behind, spear_slice, 
    jab, overcome];

function make_starting_deck(){
deck = new MoveDeck();

deck.add(basic_horizontal());
deck.add(basic_horizontal());
deck.add(basic_diagonal());
deck.add(basic_diagonal());
deck.add(slice());
deck.add(slice());
deck.add(short_charge());
deck.add(jump());

deck.deal();
return deck;
}
function make_test_deck(){
deck = new MoveDeck();
var start = 20;
for(var i = start; i < start + 5 && i < CARD_CHOICES.length; ++i){
deck.add(CARD_CHOICES[i]());
}
deck.add(basic_horizontal());
deck.add(basic_horizontal());
deck.deal();
return deck;
}

function basic_horizontal(){
return{
name: "basic horizontal",
pic: "basic_horizontal.png",
id: "",
descriptions: [
"N",
"E",
"S",
"W"
],
behavior: [
[["move", 0, -1]],
[["move", 1, 0]],
[["move", 0, 1]],
[["move", -1, 0]]

]
}
}
function basic_diagonal(){
return{
name: "basic diagonal",
pic: "basic_diagonal.png",
id: "",
descriptions: [
"NE",
"SE",
"SW",
"NW"
],
behavior: [
[["move", 1, -1]],
[["move", 1, 1]],
[["move", -1, 1]],
[["move", -1, -1]]

]
}
}
function slice(){
return{
name: "slice",
pic: "slice.png",
id: "",
descriptions: [
"N",
"E",
"S",
"W"
],
behavior: [
[["attack", 1, -1],
["attack", 0, -1],
["attack", -1, -1]],

[["attack", 1, 1],
["attack", 1, 0],
["attack", 1, -1]],

[["attack", 1, 1],
["attack", 0, 1],
["attack", -1, 1]],

[["attack", -1, 1],
["attack", -1, 0],
["attack", -1, -1]]  
]
}
}
function short_charge(){
return{
name: "short charge",
pic: "short_charge.png",
id: "",
descriptions: [
"N",
"E",
"S",
"W"
],
behavior: [
[["move", 0, -1],
["attack", 0, -1]],

[["move", 1, 0],
["attack", 1, 0]],

[["move", 0, 1],
["attack", 0, 1]],

[["move", -1, 0],
["attack", -1, 0]]
]
}
}
function jump(){
return{
name: "jump",
pic: "jump.png",
id: "",
descriptions: [
"N",
"E",
"S",
"W"
],
behavior: [
[["move", 0, -2]],
[["move", 2, 0]],
[["move", 0, 2]],
[["move", -2, 0]]
]
}
}

function straight_charge(){
return{
name: "straight charge",
pic: "straight_charge.png",
id: "",
descriptions: [
"N",
"S",
],
behavior: [
[["move", 0, -1],
["move", 0, -1],
["attack", 0, -1]],

[["move", 0, 1],
["move", 0, 1],
["attack", 0, 1]],
]
}
}
function side_charge(){
return{
name: "side charge",
pic: "side_charge.png",
id: "",
descriptions: [
"E",
"W"
],
behavior: [
[["move", 1, 0],
["move", 1, 0],
["attack", 1, 0]],

[["move", -1, 0],
["move", -1, 0],
["attack", -1, 0]]
]
}
}
function step_left(){
return{
name: "step left",
pic: "step_left.png",
id: "",
descriptions: [
"NW",
"W",
"SW"
],
behavior: [
[["move", -1, -1]],
[["move", -1, 0],
["move", -1, 0]],
[["move", -1, 1]]
]
}
}
function step_right(){
return{
name: "step right",
pic: "step_right.png",
id: "",
descriptions: [
"NE",
"E",
"SE"
],
behavior: [
[["move", 1, -1]],
[["move", 1, 0],
["move", 1, 0]],
[["move", 1, 1]]
]
}
}
function trample(){
return{
name: "trample",
pic: "trample.png",
id: "",
descriptions: [
"NE",
"NW"
],
behavior: [
[["attack", 1, -2],
["move", 1, -2]],

[["attack", -1, -2],
["move", -1, -2]]
]
}
}
function horsemanship(){
return{
name: "horsemanship",
pic: "horsemanship.png",
id: "",
descriptions: [
"NE",
"SE",
"SW",
"NW"
],
behavior: [
[["move", 2, -1]],
[["move", 2, 1]],
[["move", -2, 1]],
[["move", -2, -1]]

]
}
}
function lunge_left(){
return{
name: "lunge left",
pic: "lunge_left.png",
id: "",
descriptions: [
"SE",
"NW"
],
behavior: [
[["move", 1, 1]],

[["move", -1, -1],
["move", -1, -1],
["attack", -1, -1]]

]
}
}
function lunge_right(){
return{
name: "lunge right",
pic: "lunge_right.png",
id: "",
descriptions: [
"SW",
"NE"
],
behavior: [
[["move", -1, 1]],

[["move", 1, -1],
["move", 1, -1],
["attack", 1, -1]]

]
}
}
function sprint(){
return{
name: "sprint",
pic: "sprint.png",
id: "",
descriptions: [
"N"
],
behavior: [
[["move", 0, -1],
["move", 0, -1],
["move", 0, -1]]
]
}
}
function trident(){
return{
name: "trident",
pic: "trident.png",
id: "",
descriptions: [
"N",
"E",
"W"
],
behavior: [
[["attack", 1, -2],
["attack", 0, -2],
["attack", -1, -2]],

[["attack", 2, 1],
["attack", 2, 0],
["attack", 2, -1]],

[["attack", -2, 1],
["attack", -2, 0],
["attack", -2, -1]]

]
}
}
function whack(){
return{
name: "whack",
pic: "whack.png",
id: "",
descriptions: [
"N",
"E",
"S",
"W"
],
behavior: [
[["attack", 0, -1],
["attack", 0, -1]],

[["attack", 1, 0],
["attack", 1, 0]],

[["attack", 0, 1],
["attack", 0, 1]],

[["attack", -1, 0],
["attack", -1, 0]]

]
}
}
function spin_attack(){
return{
name: "spin attack",
pic: "spin_attack.png",
id: "",
descriptions: ["spin"],
behavior: [
[["attack", 1, 1],
["attack", 1, 0],
["attack", 1, -1],
["attack", 0, 1],
["attack", 0, -1],
["attack", -1, 1],
["attack", -1, 0],
["attack", -1, -1]]
]
}
}
function butterfly(){
return{
name: "butterfly",
pic: "butterfly.png",
id: "",
descriptions: [
"NE",
"SE",
"SW",
"NW"

],
behavior: [
[["move", 2, -2]],
[["move", 1, 1]],
[["move", -1, 1]],
[["move", -2, -2]]
]
}
}
function retreat(){
return{
name: "retreat",
pic: "retreat.png",
id: "",
descriptions: [
"SE", 
"S",
"SW"
],
behavior: [
[["move", 1, 1]],

[["move", 0, 1],
["move", 0, 1],
["move", 0, 1]],

[["move", -1, 1]]
]
}
}
function force(){
return{
name: "force",
pic: "force.png",
id: "",
descriptions: [
"N",
],
behavior: [
[["attack", 0, -1],
["move", 0, -1],
["attack", 0, -1],
["move", 0, -1]]
]
}
}
function side_attack(){
return{
name: "side attack",
pic: "side_attack.png",
id: "",
descriptions: [
"E",
"W"
],
behavior: [
[["attack", 1, 0],
["attack", 2, 0],
["attack", 3, 0],],

[["attack", -1, 0],
["attack", -2, 0],
["attack", -3, 0]]
]
}
}
function clear_behind(){
return{
name: "clear behind",
pic: "clear_behind.png",
id: "",
descriptions: [
"S"
],
behavior: [
[["attack", 1, 1],
["attack", 0, 1],
["attack", -1, 1],
["attack", 1, 2],
["attack", 0, 2],
["attack", -1, 2]]
]
}
}
function spear_slice(){
return{
name: "spear slice",
pic: "spear_slice.png",
id: "",
descriptions: [
"N", 
],
behavior: [
[["attack", 1, -2],
["attack", 1, -1],
["attack", 0, -2],
["attack", -1, -2],
["attack", -1, -1]]
]
}
}
function jab(){
return{
name: "jab",
pic: "jab.png",
id: "",
descriptions: [
"N",
"E",
"S",
"W"
],
behavior: [
[["attack", 0, -1],
["attack", 0, -2]],

[["attack", 1, 0],
["attack", 2, 0]],

[["attack", 0, 1],
["attack", 0, 2]],

[["attack", -1, 0],
["attack", -2, 0]]
]
}
}
function overcome(){
return{
name: "overcome",
pic: "overcome.png",
id: "",
descriptions: [
"N",
"S"
],
behavior: [
[
["attack", 1, -1],
["attack", 0, -1],
["attack", -1, -1],
["move", 0, -2]],

[["attack", 1, 1],
["attack", 0, 1],
["attack", -1, 1],
["move", 0, 2]]
]
}
}
