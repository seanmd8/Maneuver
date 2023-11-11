// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

const GRID_SCALE = 30; // Controls the size of tiles when the map is displayed.

class GameMap{
    #x_max; // Size of the grid's x axis.
    #y_max; // Size of the grid's y axis.
    #entity_list; // entity_list class makes keeping track of entity locations easier.
    #grid; // Grid is a 2d list of tiles representing the entity in each location.
    #floor; // The current floor number.
    #turn_count; // How many turns the player has taken.
    constructor(x_max, y_max){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#floor = 0;
        this.#turn_count = 0;
        this.erase()
    }
    erase(player_health = -1){
        // Function to start a new floor by erasing the board and adding only the player and the exit.
        // Returns the floor number.
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
        // Returns a randome space in the grid.
        x = Math.floor(Math.random() * this.#x_max);
        y = Math.floor(Math.random() * this.#y_max);
        return {x, y};
    }
    random_empty(){
        // Returns a random empty space in the grid.
        // Throws an erro if the map is full.
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count;
        var rand = Math.floor(Math.random() * num_empty);
        if(num_empty === 0){
            throw new Error("map full");
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                if(this.#grid[x][y].type === "empty"){
                    if(rand === 0){
                        return {x, y};
                    }
                    --rand;
                }
            }
        }
    }
    check_bounds(x, y){
        // Throws an error if x or y is out of bounds.
        if(x < 0 || x >= this.#x_max){
            throw new Error("x out of bounds");
        }
        if(y < 0 || y >= this.#y_max){
            throw new Error("y out of bounds");
        }
    }
    check_empty(x, y){
        // returns true if the space at grid[x, y] is empty.
        // throws an error if the space is out of bounds.
        try{
            this.check_bounds(x, y);
        }
        catch{
            return false;
        }
        return this.#grid[x][y].type === "empty";
    }
    set_exit(exit_x, exit_y){
        // Places the exit.
        // Throws an error if the space is occupied or out of bounds..
        this.check_bounds(exit_x, exit_y);
        if(!this.check_empty(exit_x, exit_y)){
            throw new Error("space not empty");
        }
        this.#entity_list.set_exit(exit_x, exit_y);
        this.#grid[exit_x][exit_y] = exit_tile();
    }
    set_player(player_x, player_y, player_health = -1){
        // Places the player. If a non-negative value is given for the player's health, it will be set to that.
        // Throws an error is the space is occupied or out of bounds.
        this.check_bounds(player_x, player_y);
        if(!this.check_empty(player_x, player_y)){
            throw new Error("space not empty");
        }
        this.#entity_list.set_player(player_x, player_y);
        var player = player_tile();
        if(player_health > 0){
            player.health = player_health;
        }
        this.#grid[player_x][player_y] = player;
    }
    add_tile(tile, x = -1, y = -1){
        // Adds a new tile to a space.
        // Returns true if it was added successfuly.
        // If x or y aren't provided, it will select a random empty space.
        try{
            if(x === -1 || y === -1){
                var position = this.random_empty();
                x = position.x;
                y = position.y;
            }
            this.check_bounds(x, y);
            if(!this.check_empty(x, y)){
                throw new Error("space not empty");
            }
        }
        catch{
            return false;
        }
        this.#grid[x][y] = tile;
        if(tile.type === "enemy"){
            this.#entity_list.add_enemy(x, y, tile);
        }
        return true;
    }
    display(){
        // Diplays the gamemap. Each element shows it's description and hp (if applicable) when clicked.
        // If any empty tiles have been marked as hit, it resets the pic to empty.
        // Shows the player's remaining health below.
		var visual_map = document.getElementById("mapDisplay");
        while(visual_map.rows.length > 0){
            visual_map.deleteRow(0);
        }
		for (var y = 0; y < this.#y_max; y++){
			var row = document.createElement("tr");
            row.id = "row " + y;
            var desc = function(str){return function(){
                describe(str);
            }};
			for (var x = 0; x < this.#x_max; x++){
                var tile_description = this.#grid[x][y].description;
                if(this.#grid[x][y].hasOwnProperty("health")){
                    tile_description = "(" + this.#grid[x][y].health + " hp) " + tile_description;
                }
                var cell = make_cell(x + " " + y, "images/tiles/" + this.#grid[x][y].pic, GRID_SCALE, desc, tile_description);
                if(this.#grid[x][y].type === "empty"){
                    this.#grid[x][y].pic = "empty.png";
                }
				row.append(cell);
			}
			visual_map.append(row);
		}
        var row = document.createElement("tr");
        row.id = "health";
        for(var i = 0; i < this.player_health(); ++i){
            var cell = make_cell("health " + i, "images/other/heart.png", GRID_SCALE);
			row.append(cell);
        }
        visual_map.append(row);
	}
    move(x1, y1, x2, y2){
        // Moves the tile at [x1, y1] to [x2, y2] if it is empty. 
        // Triggers the attempted destination's on_move if applicable.
        // Throws an error if the starting location is out of bounds.
        // Returns true if the move was successful.
        // Also throws errors if the player reaches the end of the floor or dies.
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
            this.#turn_count++;
            throw new Error("floor complete");
        }
        if(end.hasOwnProperty("on_enter")){
            // If the destination does something if moved onto, call it.
            try{
                end.on_enter(x2, y2, x1 - x2, y1 - y2, this, end);
            }
            catch(error){
                if(error.message === "game over"){
                    throw new Error("game over", {cause: end.name});
                }
                else{
                    throw error;
                }
            }
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
        // Moves the player the given relative distance.
        var pos = this.#entity_list.get_player_pos();
        return this.move(pos.x, pos.y, pos.x + x_dif, pos.y + y_dif)
    }
    player_health(){
        // Returns the player's health.
        var pos = this.#entity_list.get_player_pos();
        return this.#grid[pos.x][pos.y].health;
    }
    attack(x, y, hits = "all"){
        // Attacks the specified square.
        // hits specifes if the attacks only hits enemy, player or all tiles.
        // If an enemy dies, it's on_death effect will be triggered if applicable.
        // Throws an error if the location is out of bounds.
        // Returns true if damage was dealt.
        try{
            this.check_bounds(x, y);
        }
        catch(error){
            return false;
        }
        var target = this.#grid[x][y];
        if(target.hasOwnProperty("health") && !(target.type === "player") && (hits === "enemy" || hits === "all")){
            target.health -= 1;
            if(target.health === 0){
                this.#grid[x][y] = empty_tile()
                this.#grid[x][y].pic = "hit.png";
                if(target.type === "enemy"){
                    this.#entity_list.remove_enemy(target.id)
                }
                if(target.hasOwnProperty("on_death")){
                    var player_pos = this.#entity_list.get_player_pos();
                    target.on_death(x, y, player_pos[0] - x, player_pos[1] - y, this, target);
                }
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
        // Attacks the given square relative to the player's current positon.
        var pos = this.#entity_list.get_player_pos();
        try{
            this.attack(pos.x + x_dif, pos.y + y_dif, "all");
        }
        catch{
            throw new Error("game over", {cause: "player"});
        }
    }
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        this.#turn_count++;
        await this.#entity_list.enemy_turn(this);
    }
    display_stats(element){
        // Shows the current floor and turn number.
        element.innerText = "Floor " + this.#floor + " Turn: " + this.#turn_count;
    }
    lock(){
        // Locks the stairs for a boss fight.
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.x][pos.y] = lock_tile();
    }
    unlock(){
        // Unlocks the stairs after a boss fight.
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.x][pos.y] = exit_tile();
    }
}