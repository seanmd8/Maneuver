// ----------------Floors.js----------------
// File containing the functions for generating new floors.

const BOSS_FLOOR = [velociphile_floor, spider_queen_floor, lich_floor];

/**
 * @callback FloorGenerator Function to populate a floor.
 * @param {number} floor_number How many floors have they entered. Used to determine the combined difficulty of spawned enemies.
 * @param {Area} area Which area of the dungeon are we in.
 * @param {GameMap} map The gamemap which holds the floor.
 */
/** @type {FloorGenerator} The generator ONLY used by the default area if they have finished all the content.*/
function floor_generator(floor_num, area, map){
    if(!(floor_num % AREA_SIZE === 0) || Math.floor(floor_num / AREA_SIZE) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor_num, area, map);
    }
    else{
        BOSS_FLOOR[Math.floor(floor_num / AREA_SIZE) - 1](floor_num, area, map);
    }
}
/** @type {FloorGenerator} The standard generator to add random enemies from the area whose combined difficulty scales based on the floor number.*/
function generate_normal_floor(floor_num, area, map){
    var enemy_list = area.enemy_list;
    for(var i = floor_num * 2; i > 0;){
        var choice = random_num(enemy_list.length);
        var new_enemy = enemy_list[choice]();
        if(new_enemy.difficulty !== undefined){
            if(map.spawn_safely(new_enemy, SAFE_SPAWN_ATTEMPTS, false)){
                i -= new_enemy.difficulty;
            }
            else{
                --i;
            }
        }
    }
}

/** @type {FloorGenerator}*/
function generate_magma_floor(floor_num, area, map){
    var lava_amount = random_num(20) + 5;
    for(var i = 0; i < lava_amount; ++i){
        map.spawn_safely(lava_pool_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
    var boulder_amount = random_num(3);
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(magmatic_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
    generate_normal_floor(floor_num, area, map);
}


/** @type {FloorGenerator}*/
function generate_forest_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function generate_library_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}

/** @type {FloorGenerator}*/
function generate_sanctum_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}


