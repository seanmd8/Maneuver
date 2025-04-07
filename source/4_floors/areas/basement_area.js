/** @type {AreaGenerator}*/
function generate_basement_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}basement.png`,
        generate_floor: generate_basement_floor,
        enemy_list: [spider_tile, turret_h_tile, turret_d_tile, turret_r_tile, scythe_tile, 
                    spider_web_tile, clay_golem_tile, rat_tile, shadow_knight_tile, brightling_tile],
        boss_floor_list: [spider_queen_floor],
        next_area_list: area3,
        description: basement_description
    }
}

/** @type {FloorGenerator}*/
function generate_basement_floor(floor_num, area, map){
    if(random_num(7) === 0){
        many_walls_terrain(floor_num, area, map)
    }
    else{
        wall_terrain(floor_num, area, map)
    }
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function wall_terrain(floor_num, area, map){
    var wall_amount = Math.min(random_num(8), random_num(8));
    for(var i = 0; i < wall_amount; ++i){
        map.spawn_safely(damaged_wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
        map.spawn_safely(wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function many_walls_terrain(floor_num, area, map){
    var wall_amount = 10 + random_num(5);
    for(var i = 0; i < wall_amount; ++i){
        map.spawn_safely(damaged_wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
        map.spawn_safely(wall_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}