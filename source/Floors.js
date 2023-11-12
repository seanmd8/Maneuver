// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const AREA_SIZE = 5;
const BOSS_FLOOR = [velociphile_floor];

function floor_generator(floor, map){
    if(!(floor % AREA_SIZE === 0) || Math.floor(floor / AREA_SIZE) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor, map, ENEMY_LIST);
    }
    else{
        BOSS_FLOOR[Math.floor(floor / AREA_SIZE) - 1](floor, map);
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
    describe("Welcome to floor " + floor + ".");
}

function velociphile_floor(floor, map){
    map.add_tile(velociphile_tile());
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    describe("Welcome to floor " + floor + ".\nYou hear a deafening shriek.")
}