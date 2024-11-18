// ----------------GameMap.js----------------
// GameMap class holds the information on the current floor and everything on it.

/**
 * @callback MapEventFunction Function to execute an event on the map at the end of the enemies' turn.
 * @param {GameMap} map Function controlling behavior of the event.
 */
/**
 * @typedef {Object} MapEvent An object representing an event that will happen at the end of the enemies' turn.
 * @property {String} name The name of the event.
 * @property {MapEventFunction} behavior The event's behavior.
 */
/**
 * @typedef {Object} GridSpace
 * @property {GridSpaceLayer[]} foreground
 * @property {Tile} tile
 * @property {GridSpaceLayer[]} background
 * @property {GridSpaceLayer=} action
 * @property {GridSpaceLayer=} stunned
 * @property {GridSpaceLayer} floor
 */
/**
 * @typedef {Object} GridSpaceLayer
 * @property {string} pic
 * @property {string=} descrtiption
 * @property {TelegraphFunction=} telegraph
 * @property {TelegraphFunction=} telegraph_other
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
     * @param {Area} starting_area The starting area.
     */
    constructor(x_max, y_max, starting_area){
        this.#x_max = x_max;
        this.#y_max = y_max;
        this.#entity_list = new EntityList();
        this.#floor_num = 0;
        this.#turn_count = 0;
        this.#events = [];
        this.#area = starting_area;
        this.erase()
    }
    /**
     * Function to reset the floor so the next one can be generated,
     * @returns {number} The updated floor number.
     */
    erase(){
        try{
            // Grabs the player tile from the current floor.
            var player = this.get_player();
        }
        catch(error){
            if(error.message === ERRORS.value_not_found){
                var player = player_tile();
            }
            else{
                throw error;
            }
        }
        this.#entity_list = new EntityList();
        this.#grid = [];
        // Fill the grid with blank spaces.
        for(var i = 0; i < this.#y_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#x_max; ++j){
                this.#grid[i].push(grid_space(this.#area));
            }
        }
        // Add the player and the exit.
        var exit_location = new Point(random_num(this.#y_max), 0);
        this.set_exit(exit_location);
        var player_location = new Point(random_num(this.#y_max), this.#x_max - 1);
        this.set_player(player_location, player);
        this.#events = [];
        return ++this.#floor_num;
    }
    /**
     * @returns {Point} A random space on the floor.
     */
    random_space(){
        return new Point(random_num(this.#x_max), random_num(this.#y_max));
    }
    /**
     * @returns {Point} A random empty space on the floor.
     */
    random_empty(){
        var num_empty = this.#x_max * this.#y_max - this.#entity_list.count_non_empty;
        var rand = random_num(num_empty);
        if(num_empty === 0){
            throw new Error(ERRORS.map_full);
        }
        for(var x = 0; x < this.#x_max; ++x){
            for(var y = 0; y < this.#y_max; ++y){
                var pos = new Point(x, y)
                if(this.get_tile(pos).type === `empty`){
                    if(rand === 0){
                        return pos;
                    }
                    --rand;
                }
            }
        }
        throw new Error(ERRORS.map_full);
    }
    /**
     * Thows an error if the provided point is out of bounds.
     * @param {Point} location The point to check.
     */
    check_bounds(location){
        if(location.x < 0 || location.x >= this.#x_max){
            throw new Error(ERRORS.out_of_bounds);
        }
        if(location.y < 0 || location.y >= this.#y_max){
            throw new Error(ERRORS.out_of_bounds);
        }
    }
    /**
     * Checks if a point is within bounds.
     * @param {Point} location The point to check.
     * @returns {boolean} If the point is in bounds.
     */
    is_in_bounds(location){
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
        return this.is_in_bounds(location) && this.get_tile(location).type === `empty`;
    }
    /**
     * Checks if a location is in bounds and looks empty (could be something invisible).
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and looks empty and false otherwise.
     */
    looks_empty(location){
        return this.is_in_bounds(location) && this.get_tile(location).name === `Empty`;
    }
    /**
     * Places an exit tile at the given location
     * Throws an error if the location is out of bounds, the space is not empty or there is already an exit tile.
     * @param {Point} location The location to set the exit at.
     */
    set_exit(location){
        this.check_bounds(location);
        if(!this.check_empty(location)){
            throw new Error(ERRORS.space_full);
        }
        try{
            // If exit isn't undefined, throws error.
            this.#entity_list.get_exit_pos();
            throw new Error(ERRORS.already_exists)
        }
        catch(error) {
            if(error.message !== ERRORS.value_not_found){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_exit(location);
        this.#set_tile(location, exit_tile());
    }
    /**
     * Places the player at the given location.
     * Throws an error if player is not a player, the location is out of bounds, the space is not empty or there is already a player tile.
     * @param {Point} player_location The location to set the player at.
     * @param {Tile} player The player tile to be placed,
     */
    set_player(player_location, player){
        if(player.type !== `player`){
            throw new Error(ERRORS.invalid_value)
        }
        this.check_bounds(player_location);
        if(!this.check_empty(player_location)){
            throw new Error(ERRORS.space_full);
        }
        try{
            // If player isn't undefined, throws error.
            this.#entity_list.get_player_pos();
            throw new Error(ERRORS.already_exists)
        }
        catch(error) {
            if(error.message !== ERRORS.value_not_found){
                throw error;
            }
            // otherwise continues.
        }
        this.#entity_list.set_player_pos(player_location);
        this.#set_tile(player_location, player);
    }
    /**
     * Function to add a tile to the map.
     * @param {Tile} tile The tile to be added.
     * @param {Point} [location = undefined] Optional location to place the tile. If the location is not empty, an error will be thrown.
     *                                          If not provided, the location will be a random unoccupied one.
     * @returns {Point | void} If it successfully adds the tile, returns the location. Otherwise, returns void.
     */
    add_tile(tile, location = undefined){
        try{
            // Makes sure the location is valid and empty
            if(location === undefined){
                location = this.random_empty();
            }
            this.check_bounds(location);
            if(!this.check_empty(location)){
                throw new Error(ERRORS.space_full);
            }
        }
        catch(error){
            return;
        }
        this.#set_tile(location, tile);
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
            throw new Error(ERRORS.value_not_found);
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
        return undefined;
    }
    /**
     * Function to display the gamemap and the player's health.
     * Clicking on a tile will give info about it.
     * Resets tiles marked as hit afterwards.
     * @returns {void}
     */
    display(){
        var make_on_click = function(space, location, gameMap){
            return function(){
                var description = grid_space_description(space);
                var tile = space.tile;
                say(description, false);
                gameMap.clear_telegraphs();
                var telegraph_spaces = [];
                var telegraph_other_spaces = [];
                for(var element of [...space.foreground, ...space.background]){
                    // Checks for upcoming attacks from the things in the foreground and background.
                    if(element.telegraph !== undefined){
                        telegraph_spaces.push(...element.telegraph(location, gameMap, element));
                    }
                    if(element.telegraph_other !== undefined){
                        telegraph_other_spaces.push(...element.telegraph_other(location, gameMap, element));
                    }
                }
                // Checks for upcoming attacks from the tile itself.
                if(tile.telegraph !== undefined && !tile.stun){
                    telegraph_spaces.push(...tile.telegraph(location, gameMap, tile));
                }
                if(tile.telegraph_other !== undefined && !tile.stun){
                    telegraph_other_spaces.push(...tile.telegraph_other(location, gameMap, tile));
                }
                // Telegraphs possible upcoming attacks and other things.
                gameMap.mark_telegraph(telegraph_spaces);
                gameMap.mark_telegraph(telegraph_other_spaces, `${IMG_FOLDER.actions}telegraph_other.png`);
                display_map(gameMap);
                display.add_class(`${UIIDS.map_display} ${location.y} ${location.x}`, `selected-tile`);
            }
        }
        var grid = [];
        for(var y = 0; y < this.#y_max; ++y){
            var row = this.#grid[y];
            var table_row = [];
            for(var x = 0; x < this.#x_max; ++x){
                let space = row[x];
                let stunned = [];
                if(space.tile.stun !== undefined && space.tile.stun > 0){
                    stunned.push(`${IMG_FOLDER.actions}confuse.png`);
                }
                let foreground_pics = space.foreground.map((fg) => fg.pic);
                let background_pics = space.background.map((fg) => fg.pic);
                table_row.push({
                    name: space.tile.name,
                    foreground: foreground_pics,
                    pic: space.tile.pic,
                    rotate: space.tile.rotate,
                    flip: space.tile.flip,
                    background: [...background_pics, space.action, ...stunned, this.#area.background],
                    on_click: make_on_click(space, new Point(x, y), this)
                });
            };
            grid.push(table_row);
        }
        return grid;
	}
    /**
     * Moves a tile.
     * Throws errors if the player reaches the end of the floor or if the tile (player or not) dies.
     * @param {Point} start_point The current location of the tile to be moved.
     * @param {Point} end_point Where you want to move the tile to.
     * @returns {boolean} Returns true if the tile is moved succesfully, false if it is not.
     */
    move(start_point, end_point){
        this.check_bounds(start_point);
        if(!this.is_in_bounds(end_point)){
            return false;
        }
        var start = this.get_tile(start_point);
        var end = this.get_tile(end_point);
        if(start.type === `player` && end.type === `exit`){
            ++this.#turn_count;
            throw new Error(ERRORS.floor_complete);
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
                if(error.message === ERRORS.game_over){
                    throw new Error(ERRORS.game_over, {cause: new Error(end.name)});
                }
                if(error.message === ERRORS.skip_animation){
                    // Do nothing
                }
                else{
                    throw error;
                }
            }
            if(start.health !== undefined && start.health <= 0){
                throw new Error(ERRORS.creature_died);
            }
        }
        end = this.get_tile(end_point);
        if(end.type === `empty` && this.get_tile(start_point) === start){
            // Move.
            this.#entity_list.move_any(end_point, start);
            this.#set_tile(end_point, start);
            this.#set_tile(start_point, empty_tile());
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
        var player_pos = this.#entity_list.get_player_pos();
        var destination = this.random_empty();
        return this.move(player_pos.plus(target), destination);
    }
    /**
     * Returns the player tile. Throws an error if there isn't one.
     * @returns {Tile} The player tile.
     */
    get_player(){
        var pos = this.#entity_list.get_player_pos();
        return this.get_tile(pos);
    }
    /**
     * Returns the player's location. Throws an error if there isn't one.
     * @returns {Point} The player's location.
     */
    get_player_location(){
        return this.#entity_list.get_player_pos();
    }
    /**
     * Attacks a point on the grid.
     * @param {Point} location Where to attack.
     * @returns {boolean} Returns true if the attack hit.
     */
    attack(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}hit.png`;
        var target = space.tile;
        if(target.health !== undefined){
            target.health -= 1;
            if(target.on_hit !== undefined){
                // Trigger on_hit.
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
                // Player death.
                if(target.type === `player`){
                    if(GS.boons.has(boon_names.rebirth)){
                        this.player_heal(new Point(0, 0));
                        GS.boons.lose(boon_names.rebirth);
                        GS.refresh_boon_display();
                        say(rebirth_revival_message);
                        return true;
                    }
                    throw new Error(ERRORS.game_over);
                }
                // Non player death.
                this.#set_tile(location, empty_tile());
                if(target.type === `enemy`){
                    if(target.id === undefined){
                        throw new Error(ERRORS.missing_id);
                    }
                    this.#entity_list.remove_enemy(target.id);
                }
                else{
                    --this.#entity_list.count_non_empty;
                }
                if(target.on_death !== undefined){
                    // Trigger on_death/
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
        if(target.health === undefined && target.on_hit !== undefined){
            // Trigger on_hit
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
            return true;
        }
        return false;
    }
    /**
     * Attacks relative to the player's location.
     * @param {Point} direction Relative direction of attack.
     * @returns {boolean} Returns true if the attack hits and false otherwise.
     */
    player_attack(direction){
        var pos = this.#entity_list.get_player_pos().plus(direction);
        try{
            return this.attack(pos);
        }
        catch (error){
            if(error.message !== `game over`){
                throw error;
            }
            throw new Error(ERRORS.game_over, {cause: new Error(`player`)});
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
     * Displays the current floor number and turn count.
     * @param {string} location Where they should be displayed.
     */
    display_stats(location){
        display.display_message(location, `Floor ${this.#floor_num} Turn: ${this.#turn_count}`);
    }
    /**
     * Replaces the exit tile with a lock tile.
     * Throws an error if there is no exit.
     * @returns {void}
     */
    lock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_tile(pos, lock_tile())
    }
    /**
     * Replaces the lock tile with an exit one and heals the player to max.
     * Throws an error if there is no lock or exit.
     * @returns {void}
     */
    unlock(){
        var pos = this.#entity_list.get_exit_pos();
        this.#set_tile(pos, exit_tile());
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
                if(error.message === ERRORS.game_over){
                    throw new Error(ERRORS.game_over, {cause: new Error(event.name)});
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
        var player = this.get_player();
        if(player.health === 1 && GS.boons.has(boon_names.bitter_determination) > 0){
            // Bitter determination heals you if you are at exactly 1.
            this.player_heal(new Point(0, 0), 1);
        }
        if(GS.boons.has(boon_names.expend_vitality) > 0){
            // Expend Vitality always heals you.
            this.player_heal(new Point(0, 0), 1);
        }
        if(GS.boons.has(boon_names.pacifism) > 0){
            // Pacifism always fully heals you.
            this.player_heal(new Point(0, 0));
        }
        var floor_description = `${floor_message}${this.#floor_num}.`;
        if(this.#floor_num % AREA_SIZE === 1){
            // Reached the next area.
            var next_list = this.#area.next_area_list;
            this.#area = next_list[random_num(next_list.length)]();
            floor_description += `\n${this.#area.description}`;
        }
        if(this.#floor_num % AREA_SIZE === 0 && this.#area.boss_floor_list.length > 0){
            // Reached the boss.
            var boss_floor = this.#area.boss_floor_list[random_num(this.#area.boss_floor_list.length)];
            boss_floor_common(this.#floor_num, this.#area, this); 
            var boss_message = boss_floor(this.#floor_num, this.#area, this);
            floor_description += `\n${boss_message}`;
        }
        else{
            var extra_difficulty = 5 * GS.boons.has(boon_names.roar_of_challenge);
            this.#area.generate_floor(this.#floor_num + extra_difficulty, this.#area, this);
        }
        if(this.#floor_num % AREA_SIZE === CHEST_LOCATION){
            var chest = appropriate_chest_tile();
            var choices = GS.boons.get_choices(BOON_CHOICES + (2 * GS.boons.has(boon_names.hoarder)));
            for(var boon of choices){
                add_boon_to_chest(chest, boon);
            }
            this.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        say(floor_description);
    }
    /**
     * Gets a GridSpace from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    get_grid(location){
        this.check_bounds(location);
        return this.#grid[location.y][location.x];
    }
    /**
     * Gets a tile from a location on the grid.
     * Throws an error if the location is out of bounds.
     * @param {Point} location The location of the tile.
     * @returns {Tile} The tile at that location
     */
    get_tile(location){
        var space = this.get_grid(location);
        return space.tile;
    }
    /**
     * Puts a tile at the given location.
     * Throws an error if the location is out of bounds.
     * @param {Point} location Where to put the tile.
     * @param {Tile} value The tile to place.
     */
    #set_tile(location, value){
        this.check_bounds(location);
        this.#grid[location.y][location.x].tile = value;
    }
    /**
     * Marks which positions an entity can attack during it's next turn.
     * @param {Point[]} positions A list of positions to mark.
     * @param {string=} pic If provided, it will telegraph that rather than a hit.
     */
    mark_telegraph(positions, pic = `${IMG_FOLDER.actions}hit_telegraph.png`){
        for(var position of positions){
            if(this.is_in_bounds(position)){
                this.get_grid(position).action = pic;
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
                this.get_grid(new Point(x, y)).action = `${IMG_FOLDER.tiles}empty.png`;
            }
        }
    }
    /**
     * Function to mark a tile with a specific name, description and background.
     * @param {Point} location The location of the tile to mark.
     * @param {TileGenerator} mark Contains the fields to use.
     * @param {boolean} foreground Controls if the image will be in the foreground or background. Defaults to foregroung.
     */
    mark_event(location, mark, foreground = true){
        var space = this.get_grid(location);
        if(foreground){
            space.foreground.push(mark);
        }
        else{
            space.background.push(mark);
        }
    }
    /**
     * Function to clear all marked empty tiles.
     * @returns {void}
     */
    clear_marked(){
        for(var y = 0; y < this.#y_max; ++y){
            for(var x = 0; x < this.#x_max; ++x){
                var space = this.get_grid(new Point(x, y));
                space.foreground = [];
                space.background = [];
            }
        }
    }
    /**
     * Function to stun the enemy at a given location.
     * @param {Point} location The location of the tile to stun.
     * @returns {boolean} If something was stunned.
     */
    stun_tile(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}confuse.png`;
        var tile = space.tile;
        if(tile.type === `enemy`){
            stun(tile);
            return true;
        }
        if(tile.type === `player`){
            confuse_player();
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
    /**
     * Function to heal the tile at the given location.
     * @param {Point} location The location of the tile to heal.
     * @param {number=} amount Provides the amount to heal for. If not given, instead heals to max.
     * @returns {boolean} if healing was performed.
     */
    heal(location, amount=undefined){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}heal.png`;
        var tile = space.tile;
        if(tile.health === undefined){
            // No health to heal.
            return false;
        }
        if(amount === undefined){
            // If no amount is specified, sets health to max.
            if(tile.max_health === undefined){
                throw new Error(ERRORS.value_not_found);
            }
            var healed = tile.health < tile.max_health;
            tile.health = tile.max_health;
            return healed;
        }
        if(tile.max_health === undefined){
            // If no max health is specified, heals by the given amount.
            tile.health += amount;
            return true;
        }
        if(tile.health === tile.max_health){
            // Otherwise, only heals up to the max.
            return false;
        }
        if(amount > 0){
            ++tile.health;
            this.heal(location, amount - 1)
            return true;
        }
        return false;
    }
    /**
     * Function to heal a tile at a location relative to the player.
     * @param {Point} difference The relative location of the tile to heal.
     * @param {number=} amount Provides the amount to heal for. If not given, instead heals to max.
     * @returns {boolean} if healing was performed.
     */
    player_heal(difference, amount=undefined){
        if(amount === undefined && this.get_player().max_health === undefined){
            amount = 1;
        }
        var pos = this.#entity_list.get_player_pos();
        return this.heal(pos.plus(difference), amount);
    }
    /**
     * @returns {number} The number of turns that have elapsed.
     */
    get_turn_count(){
        return this.#turn_count;
    }
    /**
     * Checks if a location is in bounds and looks empty, or has a on_enter function.
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the tile fits the criteria, false otherwise.
     */
    looks_movable(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var tile = this.get_tile(location);
        return (tile.name === `Empty` || tile.on_enter !== undefined || tile.name === `Exit`);
    }
    get_initiative(){
        return this.#entity_list.get_initiative();
    }
}

/**
 * Creates an empty space to add to the game map's grid.
 * @param {}
 * @returns {GridSpace} The resulting array.
 */
function grid_space(area){
    return {
        foreground: [],
        tile: empty_tile(),
        background: [],
        action: `${IMG_FOLDER.tiles}empty.png`
    }
}