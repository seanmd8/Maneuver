const BOSS_FLOOR = [velociphile_floor];

function generate_floor(floor, map, enemies){
    for(var i = floor * 2; i > 0;){
        var choice = Math.floor(Math.random() * enemies.length);
        var new_enemy = enemies[choice]();
        if(new_enemy.difficulty <= i){
            map.add_tile(new_enemy);
            i -= new_enemy.difficulty;
        }
    }
}

function velociphile_floor(map){
}