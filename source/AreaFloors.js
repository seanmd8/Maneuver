// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const BOSS_FLOOR = [velociphile_floor, spider_queen_floor, lich_floor];

function floor_generator(floor_num, area, map){
    if(!(floor_num % AREA_SIZE === 0) || Math.floor(floor_num / AREA_SIZE) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor_num, area, map);
    }
    else{
        BOSS_FLOOR[Math.floor(floor_num / AREA_SIZE) - 1](floor_num, area, map);
    }
}

function generate_normal_floor(floor_num, area, map){
    var enemy_list = area.enemy_list;
    for(var i = floor_num * 2; i > 0;){
        var choice = random_num(enemy_list.length);
        var new_enemy = enemy_list[choice]();
        if(new_enemy.difficulty <= i){
            map.add_tile(new_enemy);
            i -= new_enemy.difficulty;
        }
    }
}

function generate_ruins_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
function generate_sewers_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
function generate_basement_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
function generate_magma_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
function generate_crypt_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
function generate_forest_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
function generate_library_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
function generate_sanctum_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}


