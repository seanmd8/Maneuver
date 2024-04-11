// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

/**
 * @callback MapEventFunction Function to execute an event on the map at the end of the enemies' turn.
 * @param {GameMap} map Function controlling behavior of the event.
 */
/**
 * @typedef MapEvent An object representing an event that will happen at the end of the enemies' turn.
 * @property {String} name The name of the event.
 * @property {MapEventFunction} behavior The event's behavior.
 */

class GameMap{
    /** @type {number} Size of the grid's x axis.*/
    #x_max;
    /** @type {number} Size of the grid's y axis.*/
    #y_max;
    /** @type {EntityList} Used to keep track of non player entity locations and perform their turns.*/
    #entity_list;
    /** @type {Tile[][]} Grid representing the floor layout.*/
    #grid;
    /** @type {number} Which number floor this is.*/
    #floor_num;
    /** @type {number} Total number of turns that have elapsed.*/
    #turn_count;
    /** @type {MapEvent[]} Events that will happen at the end of the turn.*/
    #events;
    /** @type {Area} The current area of the dungeon they are in.*/
    #area;
    /**
     * @param {number} x_max The x size of floors in this dungeon.
     * @param {number} y_max The y size of floors in this dungeon.
     * @param {Area} area The starting area.
     */
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
    /**
     * Function to reset the floor so the next one can be generated,
     * @returns {number} The updated floor number.
     */
    erase(){
        // Function to start a new floor by erasing the board and adding only the player and the exit.
        // Returns the floor number.
        try{
            var player = this.get_player();
        }
        catch(error){
            if(error.message === `player does not exist`){
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
        var exit_location = new Point(random_num(this.#y_max), 0);
        this.set_exit(exit_location);
        var player_location = new Point(random_num(this.#y_max), this.#x_max - 1);
        this.set_player(player_location, player);
        return ++this.#floor_num;
    }
    /**
     * @returns {Point} A random space on the floor.
     */
    random_space(){
        // Returns a random space in the grid.
        return new Point(random_num(this.#x_max), random_num(this.#y_max));
    }
    /**
     * @returns {Point} A random empty space on the floor.
     */
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
                var pos = new Point(x, y)
                if(this.get_grid(pos).type === `empty`){
                    if(rand === 0){
                        return pos;
                    }
                    --rand;
                }
            }
        }
        throw new Error(`grid full`);
    }
    /**
     * Thows an error if the provided point is out of bounds.
     * @param {Point} location The point to check.
     */
    check_bounds(location){
        // Throws an error if x or y is out of bounds.
        if(location.x < 0 || location.x >= this.#x_max){
            throw new Error(`x out of bounds`);
        }
        if(location.y < 0 || location.y >= this.#y_max){
            throw new Error(`y out of bounds`);
        }
    }
    /**
     * Checks if a point is within bounds.
     * @param {Point} location The point to check.
     * @returns {boolean} If the point is in bounds.
     */
    is_in_bounds(location){
        // Throws an error if x or y is out of bounds.
        if(location.x < 0 || location.x >= this.#x_max){
            return false;
        }
        if(location.y < 0 || location.y >= this.#y_max){
            return false;
        }
        return true;
    }
    /**
     * Checks if a location is in bounds and empty.
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and empty and false otherwise.
     */
    check_empty(location){
        // returns true if the space at grid[x, y] is empty.
        // throws an error if the space is out of bounds.
        try{
            this.check_bounds(location);
        }
        catch{
            return false;
        }
        return this.get_grid(location).type === `empty`;
    }
    /**
     * Places an exit tile at the given location
     * Throws an error if the location is out of bounds, the space is not empty or there is already an exit tile.
     * @param {Point} location The location to set the exit at.
     */
    set_exit(location){
        // Places the exit.
        // Throws an error if the space is occupied or out of bounds..
        this.check_bounds(location);
        if(!this.check_empty(location)){
            throw new Error(`space not empty`);
        }
        try{
            // If exit isn't undefined, throws error.
            this.#entity_list.get_exit_pos();
            throw new Error(`exit already set`)
        }
        catch(error) {
            if(error.message !== `exit does not exist`){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_exit(location);
        this.#set_grid(location, exit_tile());
    }
    /**
     * Places the player at the given location.
     * Throws an error if player is not a player, the location is out of bounds, the space is not empty or there is already a player tile.
     * @param {Point} player_location The location to set the player at.
     * @param {Tile} player The player tile to be placed,
     */
    set_player(player_location, player){
        // Places the player. If a non-negative value is given for the player's health, it will be set to that.
        // Throws an error is the space is occupied or out of bounds.
        if(player.type !== `player`){
            throw new Error(`tried to set non-player as player`)
        }
        this.check_bounds(player_location);
        if(!this.check_empty(player_location)){
            throw new Error(`space not empty`);
        }
        try{
            // If player isn't undefined, throws error.
            this.#entity_list.get_player_pos();
            throw new Error(`player already set`)
        }
        catch(error) {
            if(error.message !== `player does not exist`){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_player_pos(player_location);
        this.#set_grid(player_location, player);
    }
    /**
     * Function to add a tile to the map.
     * @param {Tile} tile The tile to be added.
     * @param {Point} [location = undefined] Optional location to place the tile. If the location is not empty, an error will be thrown.
     *                                          If not provided, the location will be a random unoccupied one.
     * @returns {Point | void} If it successfully adds the tile, return sthe location. Otherwise, throws an error.
     */
    add_tile(tile, location = undefined){
        // Adds a new tile to a space.
        // Returns the point if added successfully.
        // If x or y aren't provided, it will select a random empty space.
        try{
            if(location === undefined){
                location = this.random_empty();
            }
            this.check_bounds(location);
            if(!this.check_empty(location)){
                throw new Error(`space not empty`);
            }
        }
        catch(error){
            return;
        }
        this.#set_grid(location, tile);
        if(tile.type === `enemy`){
            this.#entity_list.add_enemy(location, tile);
        }
        else if(!(tile.type === `empty`)){
            ++this.#entity_list.count_non_empty;
        }
        return location.copy();
    }
    /**
     * Makes a number of attempts to spawn the given enemy at a location where it can't immediately attack the player.
     * @param {Tile} tile The tile to be added.
     * @param {number} tries The number of attempts
     * @param {boolean} force If true, the enemy will be spawned randomly using add_tile after all tries are exhausted. 
     * @returns {Point | void} If the tile is added, it returns the location. Otherwise it returns void.
     */
    spawn_safely(tile, tries, force){
        var attacks = [];
        var player_location = this.#entity_list.get_player_pos();
        if(!player_location){
            throw new Error(`player doesn't exist`);
        }
        for(var i = 0; i < tries; ++i){
            var location = this.random_empty();
            if(tile.telegraph){
                attacks = tile.telegraph(location, this, tile);
            }
            if(!attacks.find((element) => point_equals(element, player_location))){
                return this.add_tile(tile, location);
            }
        }
        if(force){
            return this.add_tile(tile);
        }
    }
    /**
     * Function to display the gamemap and the player's health.
     * Clicking on a tile will give info about it.
     * Resets tiles marked as hit afterwards.
     * @returns {void}
     */
    display(){
        // Diplays the gamemap. Each element shows it's description and hp (if applicable) when clicked.
        // If any empty tiles have been marked as hit, it resets the pic to empty.
        // Shows the player's remaining health below.
        display.clear_tb(UIIDS.map_display);
        var make_on_click = function(gameMap){
            return function(tile, location){
                var description = tile_description(tile);
                display.display_message(UIIDS.display_message, description);
                gameMap.clear_telegraphs();
                if(tile.telegraph !== undefined && !tile.stun){
                    gameMap.display_telegraph(tile.telegraph(location, gameMap, tile));
                }
                if(tile.telegraph_other !== undefined && !tile.stun){
                    gameMap.display_telegraph(tile.telegraph_other(location, gameMap, tile), `${IMG_FOLDER.tiles}telegraph_other.png`);
                }
                gameMap.display();
            }
        }
        var make_background = function(area){
            return function(tile, location){
                var backgrounds = [area.background];
                if(tile.is_hit !== undefined){
                    backgrounds.push(tile.is_hit);
                }
                if(tile.event_happening !== undefined){
                    backgrounds.push(tile.event_happening);
                }
                return backgrounds;
            }
        }        
        for(var y = 0; y < this.#y_max; y++){
            display.add_tb_row(UIIDS.map_display, this.#grid[y], TILE_SCALE, make_on_click(this), make_background(this.#area));
        }
        display.clear_tb(UIIDS.health_display);
        display_health(this.get_player(), TILE_SCALE);
        this.clear_telegraphs()
	}
    /**
     * Moves a tile.
     * Throws errors if the player reaches the end of the floor or if the tile (player or not) dies.
     * @param {Point} start_point The current location of the tile to be moved.
     * @param {Point} end_point Where you want to move the tile to.
     * @returns {boolean} Returns true if the tile is moved succesfully, false if it is not.
     */
    move(start_point, end_point){
        // Moves the tile at start_point to end_point if it is empty. 
        // Triggers the attempted destination's on_enter if applicable.
        // Throws an error if the starting location is out of bounds.
        // Returns true if the move was successful.
        // Also throws errors if the player reaches the end of the floor or dies.
        this.check_bounds(start_point);
        try{
            this.check_bounds(end_point);
        }
        catch{
            return false;
        }
        var start = this.get_grid(start_point);
        var end = this.get_grid(end_point);
        if(start.type === `player` && end.type === `exit`){
            ++this.#turn_count;
            throw new Error(`floor complete`);
        }
        if(end.on_enter !== undefined){
            // If the destination does something if moved onto, call it.
            try{
                var entity_entered = {
                    tile: end,
                    location: end_point
                }
                var mover_info = {
                    tile: start,
                    difference: start_point.minus(end_point)
                }
                end.on_enter(entity_entered, mover_info, this);
            }
            catch(error){
                if(error.message === `game over`){
                    throw new Error(`game over`, {cause: new Error(end.name)});
                }
                else{
                    throw error;
                }
            }
            if(start.health !== undefined && start.health <= 0){
                throw new Error(`creature died`);
            }
        }
        if(end.type === `empty` && this.get_grid(start_point) === start){
            this.#entity_list.move_any(end_point, start);
            this.#set_grid(end_point, start);
            this.#set_grid(start_point, empty_tile());
            return true;
        }
        return false;
    }
    /**
     * Moves the player relative to their current location.
     * @param {Point} direction Relative movement.
     * @returns {boolean} Returns true if the player is moved, false otherwise.
     */
    player_move(direction){
        // Moves the player the given relative distance.
        var player_pos = this.#entity_list.get_player_pos();
        return this.move(player_pos, player_pos.plus(direction));
    }
    /**
     * Teleports something at a space relative to the player to a random location.
     * @param {Point} target Relative location.
     * @returns {boolean} Returns true if something was teleported, false otherwise.
     */
    player_teleport(target){
        // Moves the player the given relative distance.
        var player_pos = this.#entity_list.get_player_pos();
        var destination = this.random_empty();
        return this.move(player_pos.plus(target), destination);
    }
    /**
     * Returns the player tile. Throws an error if there isn't one.
     * @returns {Tile} The player tile.
     */
    get_player(){
        // Returns the player's health.
        var pos = this.#entity_list.get_player_pos();
        return this.get_grid(pos);
    }
    /**
     * Attacks a point on the grid.
     * @param {Point} location Where to attack.
     * @param {string} [hits = `all`] Optional parameter for what type of tile the attack hits. By default it hits anything.
     * @returns {boolean} Returns true if the attack hit.
     */
    attack(location, hits = `all`){
        // Attacks the specified square.
        // hits specifes if the attacks only hits enemy, player or all tiles.
        // If an enemy dies, it's on_death effect will be triggered if applicable.
        // Throws an error if the location is out of bounds.
        // Returns true if damage was dealt.
        try{
            this.check_bounds(location);
        }
        catch(error){
            return false;
        }
        var target = this.get_grid(location);
        if(target.health !== undefined && target.type !== `player` && (hits === `enemy` || hits === `all`)){
            target.health -= 1;
            this.get_grid(location).is_hit = `${IMG_FOLDER.tiles}hit.png`;
            if(target.on_hit !== undefined){
                var player_pos = this.#entity_list.get_player_pos();
                var hit_entity = {
                    tile: target,
                    location: location
                }
                var aggressor_info = { // TODO: when damage source is implemented, use that instead.
                    tile: this.get_player(),
                    difference: player_pos.minus(location)
                }
                target.on_hit(hit_entity, aggressor_info, this);
            }
            if(target.health <= 0){
                this.#set_grid(location, empty_tile());
                this.get_grid(location).is_hit = `${IMG_FOLDER.tiles}hit.png`;
                if(target.type === `enemy`){
                    if(target.id === undefined){
                        throw new Error(`enemy missing id`);
                    }
                    this.#entity_list.remove_enemy(target.id);
                }
                if(target.on_death !== undefined){
                    var player_pos = this.#entity_list.get_player_pos();
                    var dying_entity = {
                        tile: target,
                        location: location
                    }
                    var player_info = {
                        tile: this.get_player(),
                        difference: player_pos.minus(location)
                    }
                    target.on_death(dying_entity, player_info, this);
                }
            }
            return true;
        }
        if(target.type === `player` && (hits === `player` || hits === `all`)){
            if(target.health === undefined){
                throw new Error(`player missing health`);
            }
            target.health -= 1;
            this.get_grid(location).is_hit = `${IMG_FOLDER.tiles}hit.png`;
            if(target.health === 0){
                throw new Error(`game over`)
            }
            return true;
        }
        if(target.type === `empty`){
            target.is_hit = `${IMG_FOLDER.tiles}hit.png`;
        }
        return false;
    }
    /**
     * Attacks relative to the player's location.
     * @param {Point} direction Relative direction of attack.
     * @returns {boolean} Returns true if the attack hits and false otherwise.
     */
    player_attack(direction){
        var pos = this.#entity_list.get_player_pos();
        try{
            return this.attack(pos.plus(direction), `all`);
        }
        catch (error){
            if(error.message !== `game over`){
                throw error;
            }
            throw new Error(`game over`, {cause: new Error(`player`)});
        }
    }
    /**
     * Each enemy takes their turn.
     * Throws an error if the player dies or is moved.
     * @returns {Promise<undefined>} Resolves when their turn is done.
     */
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        ++this.#turn_count;
        await this.#entity_list.enemy_turn(this);
    }
    /**
     * Displays the floor number and turn count.
     * @param {string} location Where they should be displayed.
     */
    display_stats(location){
        // Shows the current floor and turn number.
        display.display_message(location, `Floor ${this.#floor_num} Turn: ${this.#turn_count}`);
    }
    /**
     * Replaces the exit tile with a lock tile.
     * Throws an error if there is no exit.
     * @returns {void}
     */
    lock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, lock_tile())
    }
    /**
     * Replaces the lock tile with an exit one and heals the player to max.
     * Throws an error if there is no lock or exit.
     * @returns {void}
     */
    unlock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_grid(pos, exit_tile());
        var player = this.get_player();
        player.health = player.max_health;
    }
    /**
     * Schedules an event to happen at end of turn.
     * @param {MapEvent} event The even to be added.
     */
    add_event(event){
        this.#events.push(event);
    }
    /**
     * Executes and removes each scheduled event.
     * Throws an error if one that isn't handled tries to happen or the player dies.
     * @returns {void}
     */
    resolve_events(){
        var current_events = this.#events;
        this.#events = [];
        for(var event of current_events){
            try{
                event.behavior(this);
            }
            catch(error){
                if(error.message === `game over`){
                    throw new Error(`game over`, {cause: new Error(event.name)});
                }
                throw error;
            }
            
        }
        
        
    }
    /**
     * Clears the current floor and goes to the next one then generates it based on the current area.
     * @returns {void}
     */
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
        display.display_message(UIIDS.display_message, floor_description);
    }
    /**
     * Gets a tile from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    get_grid(location){
        this.check_bounds(location);
        return this.#grid[location.y][location.x];
    }
    /**
     * Puts a tile at the given location.
     * t=Throws an error if the location is out of bounds.
     * @param {Point} location Where to put the tile.
     * @param {Tile} value The tile to place.
     */
    #set_grid(location, value){
        this.check_bounds(location);
        this.#grid[location.y][location.x] = value;
    }
    /**
     * Marks which positions an entity can attack during it's next turn.
     * @param {Point[]} positions A list of positions to mark.
     * @param {string=} pic If provided, it will telegraph that rather than a hit.
     */
    display_telegraph(positions, pic = `${IMG_FOLDER.tiles}hit_telegraph.png`){
        for(var position of positions){
            if(this.is_in_bounds(position)){
                this.get_grid(position).is_hit = pic;
            }
        }
    }
    /**
     * Clears all hits and other alternate pics from empty tiles in the grid.
     * @returns {void}
     */
    clear_telegraphs(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.get_grid(new Point(x, y));
                tile.is_hit = undefined;
            }
        }
    }
    /**
     * Function to mark a tile with a specific name, description and background.
     * @param {Point} location The location of the tile to mark.
     * @param {TileGenerator} mark Contains the fields to use.
     */
    mark_tile(location, mark){
        if(this.is_in_bounds(location)){
            shapeshift(this.get_grid(location), mark, true);
        }
    }
    /**
     * Function to clear all marked empty tiles.
     * @returns {void}
     */
    clear_marked(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var tile = this.get_grid(new Point(x, y));
                if(tile.type === `empty`){
                    shapeshift(tile, empty_tile, true);
                }
            }
        }
    }
    /**
     * Function to stun the enemy at a given location.
     * @param {Point} location The location of the tile to stun.
     * @returns {boolean} If something was stunned.
     */
    stun_tile(location){
        try{
            var tile = this.get_grid(location);
        }
        catch(error){
            if(error.message === `x out of bounds` || error.message === `y out of bounds`){
                return false;
            }
            throw error;
        }
        if(tile.type === `enemy`){
            stun(tile);
            return true;
        }
        return false;
    }
    /**
     * Function to stun the enemy at a place releative to the player.
     * @param {Point} direction The location of the tile to stun relative to the player.
     * @returns {boolean} If something was stunned.
     */
    player_stun(direction){
        var pos = this.#entity_list.get_player_pos();
        return this.stun_tile(pos.plus(direction));
    }
}