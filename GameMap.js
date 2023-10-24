
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