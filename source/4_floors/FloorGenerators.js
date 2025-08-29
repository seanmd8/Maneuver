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
    area_size = init_settings().area_size;
    if(!(floor_num % area_size == 0) || Math.floor(floor_num / area_size) - 1 >= BOSS_FLOOR.length){
        generate_normal_floor(floor_num, area, map);
    }
    else{
        BOSS_FLOOR[Math.floor(floor_num / area_size) - 1](floor_num, area, map);
    }
}
/** @type {FloorGenerator} The standard generator to add random enemies from the area whose combined difficulty scales based on the floor number.*/
function generate_normal_floor(floor_num, area, map){
    if(GS.boons.has(boon_names.rift_touched)){
        for(var i = 0; i < 2; ++i){
            map.spawn_safely(darkling_tile(), SAFE_SPAWN_ATTEMPTS, true);
        }
    }
    var enemy_list = area.enemy_list;
    for(var i = floor_num * 2; i > 0;){
        var choice = random_num(enemy_list.length);
        var new_enemy = enemy_list[choice]();
        if(new_enemy.difficulty !== undefined){
            var spawned = map.spawn_safely(new_enemy, SAFE_SPAWN_ATTEMPTS, false);
            if(spawned !== undefined){
                i -= new_enemy.difficulty;
                for(var j = 0; j < 2 * GS.boons.has(boon_names.stealthy); ++j){
                    map.stun_tile(spawned);
                }
            }
            else{
                --i;
            }
        }
    }
    if(chance(GS.boons.has(boon_names.frugivore), 2)){
        map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

function boss_floor_common(floor_num,  area, map){
    if(GS.boons.has(boon_names.pacifism) === 0){
        map.lock();
    }
    if(chance(GS.boons.has(boon_names.frugivore), 2)){
        map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

/** @type {FloorGenerator}*/
function generate_sanctum_floor(floor_num, area, map){
    generate_normal_floor(floor_num, area, map);
}


