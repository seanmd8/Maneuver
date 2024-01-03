// ----------------EntityList.js----------------
// EntityList class is used by the GameMap class to keep track of entities without having to search through the map each time.

class EntityList{
    count_non_empty // Keeps track of the number of entities currently in the class.
    #player // Keeps track of the player postion.
    #exit // Keeps track of the position of the exit.
    #enemy_list // A list of each enemy currently on the board and their locations.
    #id_count // Used to give each enemy a unique id as it is added.
    constructor(){
        this.count_non_empty = 2;
        this.#id_count = 0;
        this.#exit = 0;
        this.#enemy_list = [];
    }
    next_id(){
        return ++this.#id_count;
    }
    set_player(x, y){
        this.#player = {x, y};
    }
    get_player_pos(){
        if(this.#player === undefined){
            throw new Error(`player doesn't exist`);
        }
        return {x: this.#player.x, y: this.#player.y};
    }
    set_exit(x, y){
        this.#exit = {x, y};
    }
    get_exit_pos(){
        if(this.#player === 0){
            throw new Error(`exit doesn't exist`);
        }
        return {x: this.#exit.x, y: this.#exit.y};
    }
    add_enemy(x, y, enemy){
        enemy.id = this.next_id();
        this.#enemy_list.push({x, y, enemy});
        ++this.count_non_empty;
    }
    move_enemy(x, y, id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list[index].x = x;
        this.#enemy_list[index].y = y;
    }
    remove_enemy(id){
        var index = this.#find_by_id(id);
        if(index === -1){
            throw new Error(`id not found`);
        }
        this.#enemy_list.splice(index, 1);
        --this.count_non_empty;
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
        if(entity.type === `player`){
            this.set_player(x, y);
        }
        else if(entity.type === `enemy`){
            this.move_enemy(x, y, entity.id);
        }
        else{
            throw new Error(`moving invalid type`);
        }
    }
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
                    if(e.enemy.hasOwnProperty(`stun`) && e.enemy.stun > 0){
                        --e.enemy.stun;
                    }
                    else{
                        try{
                            e.enemy.behavior(e.x, e.y, this.#player.x - e.x, this.#player.y - e.y, map, e.enemy);
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
                        throw new Error(`game over`, {cause: e.enemy.name});
                    }
                    throw error;
                }
            } 
        }
    }
}
