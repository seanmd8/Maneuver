/** @type {AreaGenerator}*/
function generate_crypt_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}crypt.png`,
        generate_floor: generate_crypt_floor,
        enemy_list: [shadow_knight_tile, vampire_tile, clay_golem_tile, turret_r_tile, shadow_scout_tile, 
                    darkling_tile, orb_of_insanity_tile],
        boss_floor_list: [lich_floor],
        next_area_list: area4,
        name: area_names.crypt,
    }
}

/** @type {FloorGenerator}*/
function generate_crypt_floor(floor_num, area, map){
    coffin_terrain(floor_num, area, map);
    generate_normal_floor(floor_num, area, map);
}
/** @type {FloorGenerator}*/
function coffin_terrain(floor_num, area, map){
    var coffin_amount = Math.min(random_num(4), random_num(4));
    for(var i = 0; i < coffin_amount; ++i){
        map.spawn_safely(coffin_tile(), SAFE_SPAWN_ATTEMPTS, false)
    }
}