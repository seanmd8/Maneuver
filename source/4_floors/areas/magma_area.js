/** @type {AreaGenerator}*/
function generate_magma_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}magma.png`,
        generate_floor: generate_magma_floor,
        enemy_list: [magma_spewer_tile, turret_r_tile, brightling_tile, igneous_crab_tile, strider_tile,
                    pheonix_tile, unstable_wisp_tile],
        boss_floor_list: [young_dragon_floor],
        next_area_list: area4,
        description: magma_description
    }
}
/** @type {FloorGenerator}*/
function generate_magma_floor(floor_num, area, map){
    if(chance(1, 6)){
        magma_lake_terrain(floor_num, area, map);
        magma_lake_terrain(floor_num, area, map);
        boulder_terrain(floor_num, area, map);
        generate_normal_floor(floor_num, area, map);
        return;
    }
    else if(chance(1, 4)){
        magma_border_terrain(floor_num, area, map);
    }
    else{
        magma_terrain(floor_num, area, map);
    }
    repulsor_terrain(floor_num, area, map);
    boulder_terrain(floor_num, area, map)
    generate_normal_floor(floor_num - 3, area, map);
}
/** @type {FloorGenerator}*/
function magma_border_terrain(floor_num, area, map){
    for(var x = 0; x < FLOOR_WIDTH; ++x){
        try{map.add_tile(lava_pool_tile(), new Point(x, 0))}
        catch{}
    }
    for(var y = 0; y < FLOOR_HEIGHT; ++y){
        try{map.add_tile(lava_pool_tile(), new Point(0, y))}
        catch{}
        try{map.add_tile(lava_pool_tile(), new Point(FLOOR_WIDTH - 1, y))}
        catch{}
    }
}
/** @type {FloorGenerator}*/
function magma_terrain(floor_num, area, map){
    var magma_amount = random_num(20) + 5;
    for(var i = 0; i < magma_amount; ++i){
        map.spawn_safely(lava_pool_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function repulsor_terrain(floor_num, area, map){
    var repulsor_amount = 0;
    for(var i = 0; i < 3; ++i){
        if(chance(1, 4)){
            ++repulsor_amount;
        }
    }
    for(var i = 0; i < repulsor_amount; ++i){
        map.spawn_safely(repulsor_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function boulder_terrain(floor_num, area, map){
    var boulder_amount = random_num(6) - 2;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(magmatic_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
    boulder_amount = random_num(6) - 2;
    for(var i = 0; i < boulder_amount; ++i){
        map.spawn_safely(animated_boulder_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }

}

/** @type {FloorGenerator}*/
function magma_lake_terrain(floor_num, area, map){
    var x_start = random_num(FLOOR_WIDTH - 5) + 1;
    var x_end = x_start + 3;
    var y_start = random_num(FLOOR_HEIGHT - 5) + 1;
    var y_end = y_start + 3;
    cross(
        range(x_start, x_end + 1),
        range(y_start, y_end + 1),
        (x, y) => {
            if(!(x === x_start || x === x_end) || !(y === y_start || y === y_end)){
                try{map.add_tile(lava_pool_tile(), new Point(x, y))}
                catch{}
            }
        }
    )
}