// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

/**
 * @typedef Tile_W_Pos An object containing a Tile and it's current position.
 * @property {Tile} enemy The tile.
 * @property {Point} location It's current location.
 */

class EntityList{
    /** @type {number} The number of nun empty tiles on the floor.*/
    count_non_empty;
    /** @type {Point | undefined} The position of the player, or undefined if they haven't been added yet.*/
    #player_pos;
    /** @type {Point | undefined} The position of the exit, or undefined if it hasn't been added yet.*/
    #exit_pos;
    /** @type {Tile_W_Pos[]} An array of each entity on the floor with a behavior as well as their location.*/
    #enemy_list;
    /** @type {number} Used to give a unique ID to each tile that is added.*/
    #id_count;

    constructor(){
        this.count_non_empty = 2;
        this.#id_count = 0;
        this.#enemy_list = [];
    }
    /**
     * Gets a unique id and increments the count.
     * @returns {number} The id.
     */
    next_id(){
        return ++this.#id_count;
    }
    /**
     * @param {Point} location Where the player's location should be set to.
     */
    set_player_pos(location){
        this.#player_pos = location;
    }
    /**
     * Returns the player's location. Throws an error if it's undefined.
     * @returns {Point} The player's location.
     */
    get_player_pos(){
        if(this.#player_pos === undefined){
            throw new Error(`player does not exist`);
        }
        return this.#player_pos.copy();
    }
    /**
     * @param {Point} location Where the exit's location should be set to
     */
    set_exit(location){
        this.#exit_pos = location;
    }
    /**
     * Returns the exit's location. Throws an error if it's undefined.
     * @returns {Point} The exit's location.
     */
    get_exit_pos(){
        if(this.#exit_pos === undefined){
            throw new Error(`exit does not exist`);
        }
        return this.#exit_pos.copy();
    }
    /**
     * Adds a new enemy and it's location to the array of enemies.
     * @param {Point} location The location of the enemy.
     * @param {Tile} enemy The tile.
     */
    add_enemy(location, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({location: location.copy(), enemy});
        ++this.count_non_empty;
    }
    /**
     * Changes an enemy's location.
     * @param {Point} location The new location.
     * @param {number} id The id of the enemy whose location should be moved. Throws an error if none match.
     */
    move_enemy(location, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list[index].location = location;
    }
    /**
     * Removes an enemy.
     * @param {number} id The id of the enemy to be removed. Throws an error if none match.
     */
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list.splice(index, 1);
        --this.count_non_empty;
    }
    /**
     * Helper function to determine the location of an entity in the entity_list.
     * @param {number} id ID to search for.
     * @returns {number} Returns the index if found and -1 if not.
     */
    #find_by_id(id){
        for(var i = 0; i < this.#enemy_list.length; ++i){
            if(this.#enemy_list[i].enemy.id === id){
                return i;
            }
        }
        return -1;
    }
    /**
     * Moves a enemy or a player. Throws an error if the type is something else or the entity is not in the entity_list.
     * @param {Point} location The new location.
     * @param {Tile} entity The Tile to be moved
     */
    move_any(location, entity){
        if(entity.type === `player`){
            this.set_player_pos(location);
        }
        else if(entity.type === `enemy`){
            if(entity.id === undefined){
                throw new Error(`enemy missing id`);
            }
            this.move_enemy(location, entity.id);
        }
        else{
            throw new Error(`moving invalid type`);
        }
    }
    /**
     * Each enemy takes a turn in order.
     * Throws an error if the player dies or is moved.
     * @param {GameMap} map The map object which their actions will be performed on.
     */
    async enemy_turn(map){
        // Triggers each enemy's behavior.
        // Displays the game map between each.
        var turn = []
        for(var i = 0; i < this.#enemy_list.length; ++i){
            turn.push(this.#enemy_list[i]);
        }
        for(var i = 0; i < turn.length; ++i){
            var e = turn[i];
            if(e.enemy.id === undefined){
                throw new Error(`enemy has no id`);
            }
            if(!(this.#find_by_id(e.enemy.id) === -1)){
                try{
                    if(e.enemy.stun !== undefined && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        var do_delay = true;
                        try{
                            if(e.enemy.behavior !== undefined){
                                var self = {
                                    tile: e.enemy,
                                    location: e.location.copy()
                                }
                                var target = {
                                    tile: map.get_player(),
                                    difference: this.get_player_pos().minus(e.location)
                                }
                                e.enemy.behavior(self, target, map);
                            }
                        }
                        catch(error){
                            if(error.message === `skip animation delay`){
                                do_delay = false;
                            }
                            else if(!(error.message === `creature died`)){
                                throw error
                            }
                        }
                        map.display();
                        if(do_delay){
                            await delay(ANIMATION_DELAY);
                        }
                    }
                }
                catch(error){
                    if(error.message === `game over`){
                        throw new Error(`game over`, {cause: new Error(e.enemy.name)});
                    }
                    throw error;
                }
            } 
        }
    }
}
