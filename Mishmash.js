
const GRID_SIZE = 30;

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
        if(x === -1 || y === -1){
            var position = this.random_empty();
            x = position.x;
            y = position.y;
        }
        this.check_bounds(x, y);
        this.check_empty(x, y);
        enemy.id = this.#entity_list.next_id();
        this.#grid[x][y] = enemy;
        this.#entity_list.add_enemy(x, y, enemy)
        ++this.#entity_list.count;
        return {x, y}
    }
    display(){
		var visual_map = document.getElementById('mapDisplay');
        
        while(visual_map.rows.length > 0){
            visual_map.deleteRow(0);
        }
		for (var y = 0; y < this.#y_max; y++){
			var row = document.createElement('tr');
            row.id = 'row ' + y;
			for (var x = 0; x < this.#x_max; x++){
				var cell = document.createElement('td');
				cell.id = x + ' ' + y;
                var image = document.createElement('img');
                image.src = "images/" + this.#grid[x][y].pic;
                image.height = GRID_SIZE;
                image.width = GRID_SIZE;
                image.setAttribute("onClick", "describe('" + this.#grid[x][y].description + "')");
				cell.append(image);
				row.append(cell);
			}
			visual_map.append(row);
		}
        var row = document.createElement('tr');
        row.id = "health";
        for(var i = 0; i < this.player_health(); ++i){
            var cell = document.createElement('td');
			cell.id = "health " + i;
            var image = document.createElement('img');
            image.src = "images/heart.png";
            image.height = GRID_SIZE;
            image.width = GRID_SIZE;
			cell.append(image);
			row.append(cell);
        }
        visual_map.append(row);
	}
    move(x1, y1, x2, y2){
        this.check_bounds(x1, y1);
        this.check_bounds(x2, y2);
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
        this.move(pos.x, pos.y, pos.x + x_dif, pos.y + y_dif)
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
            return;
        }
        var target = this.#grid[x][y];
        if(target.type === "enemy" && (hits === "enemy" || hits === "all)")){
            target.health -= 1;
            if(target.health === 0){
                this.#grid[x][y] = empty_tile()
                this.#entity_list.remove_enemy(target.id)
            }
        }
        else if(target.type === "player" && (hits === "player" || hits === "all")){
            target.health -= 1;
            if(target.health === 0){
                throw new Error("game over")
            }
        }
    }
    player_attack(x_dif, y_dif){
        var pos = this.#entity_list.get_player_pos();
        this.attack(pos.x + x_dif, pos.y + y_dif, "enemy");
    }
    enemy_turn(){
        this.#entity_list.enemy_turn(this);
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
    enemy_turn(map){
        // How to avoid multi turns via friendly fire shrinking the list?
        for(var i = 0; i < this.#enemy_list.length; ++i){
            var e = this.#enemy_list[i]
            e.enemy.behavior(e.x, e.y, this.#player.x - e.x, this.#player.y - e.y, map);
        }
    }
}
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

function turret_tile(){
    return {
        type: "enemy",
        enemy_type: "turret",
        pic: "four_turret.png",
        id: "",
        health: 1,
        difficulty: 2,
        behavior: turret_ai,
        description: turret_description
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

const empty_description = "There is nothing here.";
const exit_description = "Stairs to the next floor.";
const player_description = "You.";
const spider_description = "Spider: Will attack if next to the player. Otherwise it will move closer to them.";
const turret_description = "Turret: Does not move. Can attack orthoganally at a range.";
const scythe_description = "Scythe: Will move 3 spaces diagonally towards the player damaging them if it passes next to them.";
const knight_description = "Knight: Moves in an L shape. If it tramples the player, it will move away again.";
function spider_ai(x, y, x_dif, y_dif, map){
    if(-1 <= x_dif && x_dif <= 1 && -1 <= y_dif && y_dif <= 1){
        map.attack(x + x_dif, y + y_dif, "player");
    }
    else{
        if(x_dif > 0){
            x_dif = 1;
        }
        if(x_dif < 0){
            x_dif = -1;
        }
        if(y_dif > 0){
            y_dif = 1;
        }
        if(y_dif < 0){
            y_dif = -1;
        }
        map.move(x, y, x + x_dif, y + y_dif);
    }
}
function turret_ai(x, y, x_dif, y_dif, map){
    if(x_dif === 0){
        var direction = 1
        if(y_dif < 0){
            direction = -1;
        }
        try{
            for(var i = 1; i < 11; ++i){ 
                map.attack(x, y + i * direction);
            } 
        }
        catch(error){
            if(error.message === "y out of bounds"){
                // Do nothing
            }
            else{
                throw error;
            }
        }
    }
    if(y_dif === 0){
        var direction = 1
        if(x_dif < 0){
            direction = -1;
        }
        try{
            for(var i = 1; i < 11; ++i){ 
                map.attack(x + i * direction, y);
            } 
        }
        catch(error){
            if(error.message === "x out of bounds"){
                // Do nothing
            }
            else{
                throw error;
            }
        }
    }
}

function scythe_ai(x, y, x_dif, y_dif, map){
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
    try{
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
    catch(error){
        if(error.message === "x out of bounds" || error.message === "y out of bounds"){
            // Do nothing
        }
        else{
            throw error;
        }
    }
}

function knight_ai(x, y, x_dif, y_dif, map){
    // Needs buff
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