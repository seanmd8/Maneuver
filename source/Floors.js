// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const BOSS_FLOOR = [velociphile_floor];

function floor_generator(floor, map){
    if(true){//!(floor % 5 === 0)){
        generate_normal_floor(floor, map, ENEMY_LIST);
    }
    else{
        BOSS_FLOOR[Math.floor(floor / 5)](map);
    }
}

function generate_normal_floor(floor, map, enemies){
    for(var i = floor * 2; i > 0;){
        var choice = Math.floor(Math.random() * enemies.length);
        var new_enemy = enemies[choice]();
        if(new_enemy.difficulty <= i){
            map.add_tile(new_enemy);
            i -= new_enemy.difficulty;
        }
    }
    describe("Welcome to floor " + floor);
}

function velociphile_floor(map){
}