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
}
