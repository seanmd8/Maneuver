// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const AREA_SIZE = 5;
const BOSS_FLOOR = [velociphile_floor, spider_queen_floor, lich_floor];

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
        var choice = random_num(enemies.length);
        var new_enemy = enemies[choice]();
        if(new_enemy.difficulty <= i){
            map.add_tile(new_enemy);
            i -= new_enemy.difficulty;
        }
    }
    describe(floor_message + floor + ".");
}
function velociphile_floor(floor, map){
    map.add_tile(velociphile_tile());
    map.lock();
    for(var i = 0; i < 8; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    describe(floor_message + floor + ".\n" + velociphile_floor_message)
}
function spider_queen_floor(floor, map){
    map.add_tile(spider_queen_tile());
    map.lock();
    for(var i = 0; i < 5; ++i){
        map.add_tile(wall_tile());
        map.add_tile(damaged_wall_tile());
    }
    for(var i = 0; i < 2; ++i){
        map.add_tile(spider_web_tile());
    }
    describe(floor_message + floor + ".\n" + spider_queen_floor_message)
}
function lich_floor(floor, map){
    map.add_tile(damaged_wall_tile(), FLOOR_WIDTH - 2, FLOOR_HEIGHT - 2);
    map.add_tile(damaged_wall_tile(), 1, FLOOR_HEIGHT - 2);
    map.add_tile(damaged_wall_tile(), FLOOR_WIDTH - 2, 1);
    map.add_tile(damaged_wall_tile(), 1, 1);
    map.add_tile(lich_tile());
    map.lock();
    describe(floor_message + floor + ".\n" + lich_floor_message)
}