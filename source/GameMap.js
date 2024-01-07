// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

class GameMap{
    #x_max; // Size of the grid's x axis.
    #y_max; // Size of the grid's y axis.
    #entity_list; // entity_list class makes keeping track of entity locations easier.
    #grid; // Grid is a 2d list of tiles representing the entity in each location.
    #floor_num; // The current floor number.
    #turn_count; // How many turns the player has taken.
    #events;
    #area;
    constructor(x_max, y_max, area){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#entity_list = new EntityList();
        this.#floor_num = 0;
        this.#turn_count = 0;
        this.#events = [];
        this.#area = area;
        this.erase()
    }
    erase(){
        // Function to start a new floor by erasing the board and adding only the player and the exit.
        // Returns the floor number.
        try{
            var player = this.get_player();
        }
        catch(error){
            if(error.message === `player doesn't exist`){
                var player = player_tile();
            }
            else{
                throw error;
            }
        }
        this.#entity_list = new EntityList();
        this.#grid = [];
        for(var i = 0; i < this.#y_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#x_max; ++j){
                this.#grid[i].push(empty_tile());
            }
        }
        this.set_exit(random_num(this.#y_max), 0)
        this.set_player(random_num(this.#y_max), this.#x_max - 1, player)
        return ++this.#floor_num;
    }
    random_space(){
        // Returns a randome space in the grid.
        x = random_num(this.#x_max);
        y = random_num(this.#y_max);
        return {x, y};
    }
    random_empty(){
        // Returns a random empty space in the grid.
        // Throws an erro if the map is full.
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count_non_empty;
        var rand = random_num(num_empty);
        if(num_empty === 0){
            throw new Error(`map full`);
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                if(this.#grid[y][x].type === `empty`){
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
            throw new Error(`x out of bounds`);
        }
        if(y < 0 || y >= this.#y_max){
            throw new Error(`y out of bounds`);
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
        return this.#grid[y][x].type === `empty`;
    }
    set_exit(exit_x, exit_y){
        // Places the exit.
        // Throws an error if the space is occupied or out of bounds..
        this.check_bounds(exit_x, exit_y);
        if(!this.check_empty(exit_x, exit_y)){
            throw new Error(`space not empty`);
        }
        this.#entity_list.set_exit(exit_x, exit_y);
        this.#grid[exit_y][exit_x] = exit_tile();
    }
    set_player(player_x, player_y, player){
        // Places the player. If a non-negative value is given for the player's health, it will be set to that.
        // Throws an error is the space is occupied or out of bounds.
        this.check_bounds(player_x, player_y);
        if(!this.check_empty(player_x, player_y)){
            throw new Error(`space not empty`);
        }
        this.#entity_list.set_player(player_x, player_y);
        this.#grid[player_y][player_x] = player;
    }
    add_tile(tile, x = undefined, y = undefined){
        // Adds a new tile to a space.
        // Returns true if it was added successfuly.
        // If x or y aren't provided, it will select a random empty space.
        try{
            if(x === undefined || y === undefined){
                var position = this.random_empty();
                x = position.x;
                y = position.y;
            }
            this.check_bounds(x, y);
            if(!this.check_empty(x, y)){
                throw new Error(`space not empty`);
            }
        }
        catch{
            return false;
        }
        this.#grid[y][x] = tile;
        if(tile.type === `enemy`){
            this.#entity_list.add_enemy(x, y, tile);
        }
        else if(!(tile.type === `empty`)){
            ++this.#entity_list.count_non_empty;
        }
        return true;
    }
    display(){
        // Diplays the gamemap. Each element shows it's description and hp (if applicable) when clicked.
        // If any empty tiles have been marked as hit, it resets the pic to empty.
        // Shows the player's remaining health below.
        display.clear_tb(ui_id.map_display);
        var make_on_click = function(gameMap){
            return function(tile){
                var description = tile_description(tile);
                display.display_message(ui_id.display_message, description);
                var gameMap = gameMap;
            }
        }
        for (var y = 0; y < this.#y_max; y++){
            display.add_tb_row(ui_id.map_display, this.#grid[y], TILE_SCALE, make_on_click(this), this.#area.background);
        }
        display.clear_tb(ui_id.health_display);
        display_health(this.get_player(), TILE_SCALE);
        this.clear_empty()
	}
    clear_empty(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.#grid[y][x];
                if(tile.type === `empty`){
                    tile.pic = `${img_folder.tiles}empty.png`;
                    tile.description = empty_description;
                }
            }
        }
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
        var start = this.#grid[y1][x1];
        var end = this.#grid[y2][x2];
        if(start.type === `player` && end.type === `exit`){
            ++this.#turn_count;
            throw new Error(`floor complete`);
        }
        if(end.hasOwnProperty(`on_enter`)){
            // If the destination does something if moved onto, call it.
            try{
                end.on_enter(x2, y2, x1 - x2, y1 - y2, this, end);
            }
            catch(error){
                if(error.message === `game over`){
                    throw new Error(`game over`, {cause: end.name});
                }
                else{
                    throw error;
                }
            }
            if(start.hasOwnProperty(`health`) && start.health <= 0){
                throw new Error(`creature died`);
            }
        }
        if(end.type === `empty` && this.#grid[y1][x1] === start){
            this.#entity_list.move_any(x2, y2, start);
            this.#grid[y2][x2] = start;
            this.#grid[y1][x1] = empty_tile();
            return true;
        }
        return false;
    }
    player_move(x_dif, y_dif){
        // Moves the player the given relative distance.
        var pos = this.#entity_list.get_player_pos();
        return this.move(pos.x, pos.y, pos.x + x_dif, pos.y + y_dif)
    }
    get_player(){
        // Returns the player's health.
        var pos = this.#entity_list.get_player_pos();
        return this.#grid[pos.y][pos.x];
    }
    attack(x, y, hits = `all`){
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
        var target = this.#grid[y][x];
        if(target.hasOwnProperty(`health`) && !(target.type === `player`) && (hits === `enemy` || hits === `all`)){
            target.health -= 1;
            if(target.hasOwnProperty(`on_hit`)){
                var player_pos = this.#entity_list.get_player_pos();
                target.on_hit(x, y, player_pos[0] - x, player_pos[1] - y, this, target);
            }
            if(target.health <= 0){
                this.#grid[y][x] = empty_tile()
                this.#grid[y][x].pic = `${img_folder.tiles}hit.png`;
                if(target.type === `enemy`){
                    this.#entity_list.remove_enemy(target.id)
                }
                if(target.hasOwnProperty(`on_death`)){
                    var player_pos = this.#entity_list.get_player_pos();
                    target.on_death(x, y, player_pos[0] - x, player_pos[1] - y, this, target);
                }
            }
            return true;
        }
        if(target.type === `player` && (hits === `player` || hits === `all`)){
            target.health -= 1;
            if(target.health === 0){
                throw new Error(`game over`)
            }
            return true;
        }
        if(target.type === `empty`){
            target.pic = `${img_folder.tiles}hit.png`;
        }
        return false;
    }
    player_attack(x_dif, y_dif){
        // Attacks the given square relative to the player's current positon.
        var pos = this.#entity_list.get_player_pos();
        try{
            this.attack(pos.x + x_dif, pos.y + y_dif, `all`);
        }
        catch{
            throw new Error(`game over`, {cause: `player`});
        }
    }
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        ++this.#turn_count;
        await this.#entity_list.enemy_turn(this);
    }
    display_stats(location){
        // Shows the current floor and turn number.
        display.display_message(location, `Floor ${this.#floor_num} Turn: ${this.#turn_count}`);
    }
    lock(){
        // Locks the stairs for a boss fight.
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.y][pos.x] = lock_tile();
    }
    unlock(){
        // Unlocks the stairs after a boss fight.
        // Fully heals the player
        var pos = this.#entity_list.get_exit_pos();
        this.#grid[pos.y][pos.x] = exit_tile();
        pos = this.#entity_list.get_player_pos();
        this.#grid[pos.y][pos.x].health = this.#grid[pos.y][pos.x].max_health;
    }
    add_event(event){
        this.#events.push(event);
    }
    resolve_events(){
        var new_events = [];
        for(var i = 0; i < this.#events.length; ++i){
            var event = this.#events[i];
            if(event[0] === `earthquake`){
                var rubble = [];
                for(var j = 0; j < event[1]; ++j){
                    var space = this.random_empty();
                    this.#grid[space.y][space.x].description = falling_rubble_description;
                    this.#grid[space.y][space.x].pic = `${img_folder.tiles}falling_rubble.png`;
                    rubble.push(space);
                }
                new_events.push([`earthquake_rubble`, rubble]);
            }
            else if(event[0] === `earthquake_rubble`){
                try{
                    for(var j = 0; j < event[1].length; ++j){
                        this.attack(event[1][j].y, event[1][j].x);
                    }
                }
                catch(error){
                    if(error.message === `game over`){
                        throw new Error(`game over`, {cause: `falling rubble`});
                    }
                    throw error;
                }
            }
        }
        this.#events = new_events;
    }
    next_floor(){
        this.erase();
        var floor_description = `${floor_message}${this.#floor_num}.`;
        if(this.#floor_num % AREA_SIZE === 1){
            var next_list = this.#area.next_area_list;
            this.#area = next_list[random_num(next_list.length)]();
            floor_description = `${floor_description}\n${this.#area.description}`;
        }
        if(this.#floor_num % AREA_SIZE === 0 && this.#area.boss_floor_list.length > 0){
            var boss_floor = this.#area.boss_floor_list[random_num(this.#area.boss_floor_list.length)]; 
            var boss_message = boss_floor(this.#floor_num, this.#area, this);
            floor_description = `${floor_description}\n${boss_message}`;
        }
        else{
            this.#area.generate_floor(this.#floor_num, this.#area, this);
        }
        display.display_message(ui_id.display_message, floor_description);
    }
}