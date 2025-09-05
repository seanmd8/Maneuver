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
 * @property {string=} description
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
    /** @type {StatTracker} Tracks various statistics about the game.*/
    stats;
    /** @type {MapEvent[]} Events that will happen at the end of the turn.*/
    #events;
    /** @type {Area} The current area of the dungeon they are in.*/
    #area;
    /**@type {boolean} Keeps track of if it is currently the player's turn or not.*/
    #is_player_turn;
    /**@type {Point[]} Keeps track of the current position of the exit(s)*/
    #exit_pos;
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
        this.stats = new StatTracker();
        this.#events = [];
        this.#area = starting_area;
        this.#is_player_turn = true;
        this.#exit_pos = [];
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
        this.#exit_pos = [];
        ++this.#floor_num;
        // Fill the grid with blank spaces.
        for(var i = 0; i < this.#y_max; ++i){
            this.#grid.push([]);
            for(var j = 0; j < this.#x_max; ++j){
                this.#grid[i].push(grid_space(this.#area));
            }
        }
        // Add the player and the exit.
        if(this.#floor_num % init_settings().area_size === 0){
            var areas = randomize_arr(this.#area.next_area_list);
            for(var i = 0; i < GS.boons.has(boon_names.choose_your_path) + 1 && i < areas.length; ++i){
                this.set_exit(undefined, areas[i]());
            }
        }
        else{
            this.set_exit();
        }
        var player_location = new Point(random_num(this.#y_max), this.#x_max - 1);
        this.set_player(player_location, player);
        this.#events = [];
        return this.#floor_num;
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
                if(this.get_tile(pos).type === entity_types.empty){
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
        return this.is_in_bounds(location) && this.get_tile(location).type === entity_types.empty;
    }
    /**
     * Checks if a location is in bounds and looks empty (could be something invisible).
     * @param {Point} location The point to check.
     * @returns {boolean} Returns true if the location is both in bounds and looks empty and false otherwise.
     */
    looks_empty(location){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var tile = this.get_tile(location);
        var looks_empty = tile.look !== undefined && tile.look.type === entity_types.empty;
        return this.check_empty(location) || looks_empty;
    }
    /**
     * Places an exit tile at the given location
     * Throws an error if the location is out of bounds, the space is not empty or there is already an exit tile.
     * @param {Point} location The location to set the exit at.
     */
    set_exit(location = undefined, next_area = undefined){
        if(location === undefined){
            var top_row = range(this.#y_max);
            var points = top_row.map((y) => {
                return new Point(y, 0)
            }).filter((p) => {
                return this.check_empty(p);
            })
            location = rand_from(points);
        }
        this.check_bounds(location);
        if(!this.check_empty(location)){
            throw new Error(ERRORS.space_full);
        }
        var exit = exit_tile()
        if(next_area !== undefined){
            exit.next_area = next_area;
            this.get_grid(location).floor = next_area.background;
        }
        this.#exit_pos.push(location);
        this.add_tile(exit, location);
    }
    /**
     * Places the player at the given location.
     * Throws an error if player is not a player, the location is out of bounds, the space is not empty or there is already a player tile.
     * @param {Point} player_location The location to set the player at.
     * @param {Tile} player The player tile to be placed,
     */
    set_player(player_location, player){
        if(player.type !== entity_types.player){
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
        if(tile.type === entity_types.enemy){
            this.#entity_list.add_enemy(location, tile);
        }
        else if(!(tile.type === entity_types.empty)){
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
     */
    display(){
        var make_on_click = function(space, location, gameMap){
            return function(){
                var description = grid_space_description(space);
                var tile = space.tile;
                if(tile.look !== undefined){
                    tile = tile.look;
                }
                say(description);
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
                var tile = space.tile.look === undefined ? space.tile : space.tile.look;
                let foreground_pics = space.foreground.map((fg) => fg.pic);
                let background_pics = space.background.map((fg) => fg.pic);
                table_row.push({
                    name: tile.name,
                    foreground: foreground_pics,
                    pic: tile.pic,
                    rotate: tile.rotate,
                    flip: tile.flip,
                    background: [...background_pics, space.action, ...stunned, space.floor],
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
        if(start.type === entity_types.player && end.type === entity_types.exit){
            this.stats.increment_turn();
            var floor_turns = this.stats.finish_floor();
            if(floor_turns <= 3){
                GS.achieve(achievement_names.peerless_sprinter);
            }
            if(end.next_area !== undefined){
                this.#area.next_area_list = [end.next_area];
            }
            throw new Error(ERRORS.floor_complete);
        }
        if(start.type === entity_types.player && end.type === entity_types.final_exit){
            this.stats.increment_turn();
            throw new Error(ERRORS.victory);
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
        if(end.type === entity_types.empty && this.get_tile(start_point) === start){
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
    attack(location, source = undefined){
        if(!this.is_in_bounds(location)){
            return false;
        }
        var space = this.get_grid(location);
        space.action = `${IMG_FOLDER.actions}hit.png`;
        var target = space.tile;
        if(target.health === 0){
            return false;
        }
        if(target.health !== undefined && !target.tags.has(TAGS.invulnerable)){
            target.health -= 1;
            if(source !== undefined && source.tile.type === entity_types.player){
                this.stats.increment_damage_dealt();
            }
            if(target.tags.has(TAGS.boss)){
                this.stats.damage_boss();
            }
            if(target.type === entity_types.player){
                if(this.#is_player_turn){
                    this.stats.increment_turn_damage();
                }
                else{
                    this.stats.increment_damage();
                }
                if(chance(GS.boons.has(boon_names.quick_healing), 4)){
                    this.player_heal(new Point(0, 0), 1);
                }
            }
            var current_health = target.health;
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
            if(current_health <= 0){
                // Player death.
                if(target.type === entity_types.player){
                    if(GS.boons.has(boon_names.rebirth)){
                        this.player_heal(new Point(0, 0));
                        GS.boons.lose(boon_names.rebirth);
                        GS.refresh_boon_display();
                        say_record(boon_messages.rebirth);
                        return true;
                    }
                    throw new Error(ERRORS.game_over);
                }
                // Non player death.
                this.#set_tile(location, empty_tile());
                if(target.type === entity_types.enemy){
                    if(target.id === undefined){
                        throw new Error(ERRORS.missing_id);
                    }
                    this.#entity_list.remove_enemy(target.id);
                    if(source !== undefined && source.tile.type === entity_types.player){
                        this.stats.increment_kills();
                    }
                }
                else{
                    --this.#entity_list.count_non_empty;
                }
                if(target.on_death !== undefined){
                    // Trigger on_death
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
        if((target.health === undefined || !target.tags.has(TAGS.invulnerable)) && target.on_hit !== undefined){
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
        var player_pos = this.#entity_list.get_player_pos();
        var pos = player_pos.plus(direction);
        var current_kills = this.stats.get_stats().kills;
        try{
            if(
                chance(GS.boons.has(boon_names.flame_strike), 3) && 
                direction.within_radius(1) && !direction.is_origin() &&
                this.check_empty(pos)
            ){
                var fireball = shoot_fireball(direction);
                this.add_tile(fireball, pos);
            }
            var hit = this.attack(pos, {tile: this.get_player(), location: player_pos});
            if(current_kills < this.stats.get_stats().kills && GS.boons.has(boon_names.shattered_glass)){
                for(var offset of ALL_DIRECTIONS){
                    var p_offset = pos.plus(offset);
                    if(
                        this.is_in_bounds(p_offset) && 
                        this.get_tile(p_offset).type !== entity_types.player &&
                        this.get_tile(p_offset).type !== entity_types.chest
                    ){
                        this.player_attack(direction.plus(offset));
                    }
                }
            }
            return hit;
        }
        catch (error){
            if(error.message !== `game over`){
                throw error;
            }
            throw new Error(ERRORS.game_over, {cause: new Error(special_tile_names.player)});
        }
    }
    /**
     * Each enemy takes their turn.
     * Throws an error if the player dies or is moved.
     * @returns {Promise<undefined>} Resolves when their turn is done.
     */
    async enemy_turn(){
        // Causes each enemy to execute their behavior.
        this.stats.increment_turn();
        this.#is_player_turn = false;
        await this.#entity_list.enemy_turn(this);
        this.#is_player_turn = true;
    }
    /**
     * Displays the current floor number and turn count.
     * @param {string} location Where they should be displayed.
     */
    display_stats(location){
        var stats = this.stats.get_stats();
        var stat_message = 
            `${gameplay_labels.floor} ${this.#floor_num} `
            +`${gameplay_labels.turn} ${stats.turn_number}`;
        display.display_message(location, stat_message);
    }
    /**
     * Replaces the exit tile with a lock tile.
     * @returns {void}
     */
    lock(){
        for(var pos of this.#exit_pos){
            var lock = lock_tile();
            lock.next_area = this.get_tile(pos).next_area;
            this.#set_tile(pos, lock);
        }
    }
    /**
     * Replaces the lock tile with an exit one.
     * @returns {void}
     */
    unlock(){
        for(var pos of this.#exit_pos){
            var exit = exit_tile();
            exit.next_area = this.get_tile(pos).next_area;
            this.#set_tile(pos, exit);
        }
    }
    remove_exit(){
        for(var pos of this.#exit_pos){
            this.#set_tile(pos, empty_tile());
            this.get_grid(pos).floor = this.#area.background;
        }
        this.#exit_pos = [];
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
        var area_size = init_settings().area_size
        if(this.#floor_num === 5 && this.stats.get_stats().damage_dealt === 0){
            GS.achieve(achievement_names.non_violent);
        }
        if(this.#floor_num === 15 && GS.deck.deck_size() === 5){
            GS.achieve(achievement_names.minimalist);
        }
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
        if(GS.boons.has(boon_names.vicious_cycle) > 0){
            // Vicious Cycle always fully heals you.
            this.player_heal(new Point(0, 0));
        }
        var floor_description = `${gameplay_text.floor}${this.#floor_num}.`;
        if(this.#floor_num % area_size === 1){
            // Reached the next area.
            var next_list = this.#area.next_area_list;
            this.#area = rand_from(next_list);
            floor_description += `\n${this.#area.description}`;
            for(var list of this.#grid){
                for(var point of list){
                    point.floor = this.#area.background;
                }
            }
        }
        if(this.#floor_num % area_size === 0 && this.#area.boss_floor_list.length > 0){
            // Reached the boss.
            var boss_floor = rand_from(this.#area.boss_floor_list);
            boss_floor_common(this.#floor_num, this.#area, this); 
            var boss_message = boss_floor(this.#floor_num, this.#area, this);
            floor_description += `\n${boss_message}`;
        }
        else{
            // Normal floor.
            var extra_difficulty = 5 * GS.boons.has(boon_names.roar_of_challenge);
            extra_difficulty -= 3 * GS.boons.has(boon_names.empty_rooms);
            this.#area.generate_floor(this.#floor_num + extra_difficulty, this.#area, this);
        }
        if(floor_has_chest(this.#floor_num % area_size)){
            var chest_count = 1 + GS.boons.has(boon_names.hoarder);
            var chest = appropriate_chest_tile();
            var choices = GS.boons.get_choices(BOON_CHOICES + (2 * GS.boons.has(boon_names.larger_chests)));
            for(var boon of choices){
                add_boon_to_chest(chest, boon);
            }
            this.spawn_safely(chest, SAFE_SPAWN_ATTEMPTS, true);
        }
        say_record(floor_description);
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
        if(tile.type === entity_types.enemy){
            stun(tile);
            return true;
        }
        if(tile.type === entity_types.player){
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
        var stunned = this.stun_tile(pos.plus(direction));
        if( // Pressure points boon
            stunned && 
            chance(GS.boons.has(boon_names.pressure_points), 3) && 
            !direction.is_origin()
        ){
            this.player_attack(direction);
        }
        return stunned;
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
        var stats = this.stats.get_stats();
        return stats.turn_number;
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
        return (
            tile.name === entity_types.empty || 
            tile.type === entity_types.exit ||
            tile.on_enter !== undefined || 
            tile.tags.has(TAGS.hidden)
        );
    }
    get_initiative(){
        return this.#entity_list.get_initiative();
    }
}

function grid_space(area){
    return {
        foreground: [],
        tile: empty_tile(),
        background: [],
        floor: area.background,
        action: `${IMG_FOLDER.tiles}empty.png`
    }
}