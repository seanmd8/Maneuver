/** @type {AreaGenerator}*/
function generate_sewers_area(){
    return {
        background: `${IMG_FOLDER.backgrounds}sewers.png`,
        generate_floor: generate_sewers_floor,
        enemy_list: [rat_tile, turret_h_tile, turret_d_tile, large_porcuslime_tile, medium_porcuslime_tile, 
                    corrosive_caterpillar_tile, noxious_toad_tile, acid_bug_tile, carrion_flies_tile],
        boss_floor_list: [two_headed_serpent_floor],
        next_area_list: area3,
        description: sewers_description
    }
}

/** @type {FloorGenerator}*/
function generate_sewers_floor(floor_num, area, map){
    var terrains = [slime_terrain, grate_terrain];
    terrains[random_num(terrains.length)](floor_num, area, map);
    generate_normal_floor(floor_num, area, map);
}

/** @type {FloorGenerator}*/
function slime_terrain(floor_num, area, map){
    var slime_amount = random_num(4);
    for(var i = 0; i < slime_amount; ++i){
        map.spawn_safely(corrosive_slime_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}
/** @type {FloorGenerator}*/
function grate_terrain(floor_num, area, map){
    var grate_amount = random_num(3);
    for(var i = 0; i < grate_amount; ++i){
        map.spawn_safely(sewer_grate_tile(), SAFE_SPAWN_ATTEMPTS, false);
    }
}