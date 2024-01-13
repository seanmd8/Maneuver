// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

class EntityList{
    count_non_empty // Keeps track of the number of entities currently in the class.
    #player_pos // Keeps track of the player postion.
    #exit_pos // Keeps track of the position of the exit.
    #enemy_list // A list of each enemy currently on the board and their locations.
    #id_count // Used to give each enemy a unique id as it is added.
    constructor(){
        this.count_non_empty = 2;
        this.#id_count = 0;
        this.#enemy_list = [];
    }
    /**
     * @returns {number}
     */
    next_id(){
        return ++this.#id_count;
    }
    /**
     * @param {Point} location 
     */
    set_player_pos(location){
        this.#player_pos = location;
    }
    /**
     * @returns {Point} 
     */
    get_player_pos(){
        if(this.#player_pos === undefined){
            throw new Error(`player does not exist`);
        }
        return this.#player_pos.copy();
    }
    /**
     * @param {Point} location 
     */
    set_exit(location){
        this.#exit_pos = location;
    }
    /**
     * @returns {Point} 
     */
    get_exit_pos(){
        if(this.#exit_pos === undefined){
            throw new Error(`exit does not exist`);
        }
        return this.#exit_pos.copy();
    }
    /**
     * @param {Point} location 
     * @param {Tile} enemy
     */
    add_enemy(location, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({location, enemy});
        ++this.count_non_empty;
    }
    /**
     * @param {Point} location 
     * @param {number} id 
     */
    move_enemy(location, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list[index].location = location;
    }
    /**
     * @param {number} id 
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
     * @param {number} id 
     * @returns {number}
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
     * @param {Point} location 
     * @param {Tile} entity 
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
     * @param {GameMap} map 
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
            if(!(this.#find_by_id(e.enemy.id) === -1)){
                try{
                    if(e.enemy.stun !== undefined && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        try{
                            e.enemy.behavior(e.location, this.#player_pos.minus(e.location), map, e.enemy);
                        }
                        catch(error){
                            if(!(error.message === `creature died`)){
                                throw error
                            }
                        }
                        map.display();
                        await delay(ANIMATION_DELAY);
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
