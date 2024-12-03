/** @type {AreaGenerator}*/
function generate_forest_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}forest.png`,
        generate_floor: generate_forest_floor,
        enemy_list: [vinesnare_bush_tile, carrion_flies_tile, ram_tile, swaying_nettle_tile, living_tree_tile, 
                    scythe_tile, scorpion_tile, thorn_bush_tile],
        boss_floor_list: [forest_heart_floor],
        next_area_list: area5,
        description: forest_description
    }
}

/** @type {FloorGenerator}*/
function generate_forest_floor(floor_num, area, map){
    if(random_num(16) === 0 && !floor_has_chest(floor_num % AREA_SIZE)){
        swaying_nettle_terrain(floor_num, area, map);
        generate_normal_floor(floor_num / 2, area, map);
    }
    else{
        enticing_fruit_tree_terrain(floor_num, area, map);
        generate_normal_floor(floor_num, area, map);
    }
}
/** @type {FloorGenerator}*/
function enticing_fruit_tree_terrain(floor_num, area, map){
    if(random_num(5) > 2){
        map.spawn_safely(enticing_fruit_tree_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}

/** @type {FloorGenerator}*/
function swaying_nettle_terrain(floor_num, area, map){
    var amount = 15 + random_num(8);
    for(var i = 0; i < amount; ++i){
        map.spawn_safely(swaying_nettle_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}